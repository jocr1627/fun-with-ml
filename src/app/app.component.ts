import { Component } from '@angular/core';
import { Model } from 'fun-with-ml-schema';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';
import { DropdownValueAccessors } from './components';
import { ModelService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public $generatedText: Observable<string> = null;
  public $models: Observable<Model[]> = null;
  public chartData: {
    name: string;
    series: { name: string; value: number }[];
  }[] = [{ name: 'Loss', series: [] }];
  public model: Model = null;
  public modelAccessors: DropdownValueAccessors<Model> = {
    text: model => model && model.name
  };
  public modelName: string = null;
  public url: string = null;

  private $model: BehaviorSubject<Model> = new BehaviorSubject(null);
  private subscriptions: Subscription[] = [];

  constructor(private modelService: ModelService) {
    this.$models = this.modelService.models().pipe(map(result => result.data));
  }

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
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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
    this.$generatedText = this.modelService
      .generateTextFromModel({ count: 10, id: this.model.id, maxLength: 100 })
      .pipe(map(result => result.data && result.data.text.join('\n\n')));
  }

  public onClickTrainButton() {
    this.subscriptions.push(
      this.modelService
        .trainModel({
          force: true,
          id: this.model.id,
          url: this.url
        })
        .subscribe(result => {
          if (result.data && result.data.batch !== null) {
            this.chartData = [
              {
                name: 'Loss',
                series: this.chartData[0].series.concat({
                  name: result.data.batch.toString(),
                  value: result.data.loss
                })
              }
            ];
          }
        })
    );
    this.url = null;
  }
}
