import { Component } from '@angular/core';
import { ApolloQueryResult } from 'apollo-client';
import { GenerateJob, JobStatus, Model, TrainingJob } from 'fun-with-ml-schema';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DropdownValueAccessors, InputType } from './components';
import { ModelService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public chartData: {
    name: string;
    series: { name: string; value: number }[];
  }[] = [];
  public count: number = 1;
  public epochs: number = 1;
  public generateJob: GenerateJob = null;
  public generatedText: string[] = [];
  public InputType = InputType;
  public JobStatus = JobStatus;
  public maxLength: number = 100;
  public model: Model = null;
  public modelAccessors: DropdownValueAccessors<Model> = {
    text: model => model && model.name
  };
  public modelName: string = null;
  public models: Model[] = [];
  public nameError: string = null;
  public prefix: string = '';
  public selector: string = 'body';
  public temperature: number = 0.5;
  public trainingJob: TrainingJob = null;
  public url: string = 'https://en.wikipedia.org/wiki/Structured_prediction';

  private $modelId: BehaviorSubject<string> = new BehaviorSubject(null);
  private subscriptions: Subscription[] = [];

  constructor(private modelService: ModelService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.$modelId
        .asObservable()
        .pipe(
          switchMap(modelId => {
            if (modelId === null) {
              return of(null);
            }

            return this.modelService.model({ id: modelId });
          })
        )
        .subscribe(result => {
          this.model = result && (result as ApolloQueryResult<Model>).data;
        })
    );

    this.subscriptions.push(
      this.modelService.models().subscribe(result => {
        this.models = result.data;

        if (!this.model && this.models.length > 0) {
          this.$modelId.next(this.models[0].id);
        }
      })
    );

    this.subscriptions.push(
      this.$modelId
        .pipe(
          switchMap(modelId => {
            if (modelId === null) {
              return of(null);
            }

            return this.modelService.batchCompleted({ id: modelId });
          })
        )
        .subscribe(result => {
          this.trainingJob = result && result.data;

          if (
            !result ||
            !result.data ||
            result.data.status === JobStatus.PENDING
          ) {
            this.chartData = [];
            return;
          }

          const { batch, epoch, errors, loss, status } = result.data;

          if (status === JobStatus.ACTIVE) {
            const entry = this.chartData[epoch];
            const series = entry ? entry.series : [];

            series.push({ name: batch.toString(), value: loss });
            this.chartData = [...this.chartData];
            this.chartData[epoch] = { name: `Epoch ${epoch}`, series };
          }
        })
    );

    this.subscriptions.push(
      this.$modelId
        .pipe(
          switchMap(modelId => {
            if (modelId === null) {
              return of(null);
            }

            return this.modelService.textGenerated({ id: modelId });
          })
        )
        .subscribe(result => {
          this.generateJob = result && result.data;

          if (!result || !result.data) {
            this.generatedText = [];
            return;
          }

          const { text } = result.data;

          this.generatedText = text;
        })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public isJobPending(job: GenerateJob | TrainingJob): boolean {
    return job && job.status === JobStatus.PENDING;
  }

  public isJobInProgress(job: GenerateJob | TrainingJob): boolean {
    return (
      job &&
      (job.status === JobStatus.ACTIVE || job.status === JobStatus.PENDING)
    );
  }

  public onChangeModel() {
    this.$modelId.next(this.model.id);
  }

  public onChangeName() {
    const modelNames = this.models.map(model => model.name);

    if (modelNames.indexOf(this.modelName) >= 0) {
      this.nameError = 'Name already exists!';
    } else {
      this.nameError = null;
    }
  }

  public onClickCreateNewButton() {
    this.subscriptions.push(
      this.modelService
        .createModel({ name: this.modelName })
        .subscribe(result => this.$modelId.next(result.data && result.data.id))
    );

    this.modelName = null;
  }

  public onClickGenerateButton() {
    this.subscriptions.push(
      this.modelService
        .generateTextFromModel({
          count: this.count,
          id: this.model.id,
          maxLength: this.maxLength,
          prefix: this.prefix,
          temperature: this.temperature
        })
        .subscribe()
    );
  }

  public onClickTrainButton() {
    const { name, urls } = this.model;
    const hasUrl = urls.indexOf(this.url) >= 0;

    if (hasUrl) {
      const response = confirm(
        `Model ${name} has already been trained on ${
          this.url
        }. Would you like to continue?`
      );

      if (!response) {
        return;
      }
    }

    if (!hasUrl) {
      this.model = { ...this.model, urls: this.model.urls.concat(this.url) };
    }

    this.chartData = [];

    this.subscriptions.push(
      this.modelService
        .trainModel({
          epochs: this.epochs,
          force: true,
          id: this.model.id,
          selectors: [this.selector],
          url: this.url
        })
        .subscribe()
    );
  }
}
