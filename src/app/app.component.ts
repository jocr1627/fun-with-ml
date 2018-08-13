import { Component } from '@angular/core';
import { JobStatus, Model, TrainingJob } from 'fun-with-ml-schema';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter, flatMap } from 'rxjs/operators';
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
  }[] = [{ name: 'Loss', series: [] }];
  public count: number = 1;
  public epochs: number = 1;
  public error: string = null;
  public generatedText: string[] = [];
  public InputType = InputType;
  public isJobInProgress: boolean = false;
  public maxLength: number = 100;
  public model: Model = null;
  public modelAccessors: DropdownValueAccessors<Model> = {
    text: model => model && model.name
  };
  public modelName: string = null;
  public models: Model[] = [];
  public prefix: string = '';
  public selector: string = 'body';
  public temperature: number = 0.5;
  public url: string = 'https://en.wikipedia.org/wiki/Structured_prediction';

  private $model: BehaviorSubject<Model> = new BehaviorSubject(null);
  private subscriptions: Subscription[] = [];

  constructor(private modelService: ModelService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.$model
        .asObservable()
        .pipe(
          filter(model => Boolean(model)),
          flatMap(model => this.modelService.model({ id: model.id }))
        )
        .subscribe(result => (this.model = result.data))
    );

    this.subscriptions.push(
      this.modelService
        .models()
        .subscribe(result => (this.models = result.data))
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public onChangeName() {
    const modelNames = this.models.map(model => model.name);

    if (modelNames.indexOf(this.modelName) >= 0) {
      this.error = 'Name already exists!';
    } else {
      this.error = null;
    }
  }

  public onClickCreateNewButton() {
    this.subscriptions.push(
      this.modelService
        .createModel({ name: this.modelName })
        .subscribe(result => this.$model.next(result.data))
    );

    this.modelName = null;
  }

  public onClickGenerateButton() {
    this.isJobInProgress = true;

    this.subscriptions.push(
      this.modelService
        .generateTextFromModel({
          count: this.count,
          id: this.model.id,
          maxLength: this.maxLength,
          prefix: this.prefix,
          temperature: this.temperature
        })
        .subscribe(result => {
          this.isJobInProgress =
            result.data && result.data.status !== JobStatus.DONE;

          this.generatedText = result.data
            ? result.data.text
            : this.generatedText;
        })
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
    this.isJobInProgress = true;

    this.subscriptions.push(
      this.modelService
        .trainModel({
          epochs: this.epochs,
          force: true,
          id: this.model.id,
          selectors: [this.selector],
          url: this.url
        })
        .subscribe(result => {
          this.isJobInProgress =
            result.data && result.data.status !== JobStatus.DONE;

          if (!result.data) {
            return;
          }

          const { batch, epoch, loss, status } = result.data;

          if (status === JobStatus.ACTIVE) {
            const entry = this.chartData[epoch];
            const series = entry ? entry.series : [];

            series[batch] = { name: batch.toString(), value: loss };
            this.chartData = [...this.chartData];
            this.chartData[epoch] = { name: `Epoch ${epoch}`, series };
          }
        })
    );
    this.url = null;
  }
}
