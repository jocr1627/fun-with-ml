import { Component } from '@angular/core';
import { Model, TrainingJob } from 'fun-with-ml-schema';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DropdownValueAccessors } from './components';
import { ModelService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public $models: Observable<Model[]> = null;
  public $trainingJob: Observable<TrainingJob> = null;
  public model: Model = null;
  public modelAccessors: DropdownValueAccessors<Model> = {
    text: model => model && model.name
  };
  public modelName: string = null;
  public url: string = null;

  private subscriptions: Subscription[] = [];

  constructor(private modelService: ModelService) {
    this.$models = this.modelService.models().pipe(map(result => result.data));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public onClickCreateNewButton() {
    this.subscriptions.push(
      this.modelService
        .createModel({ name: this.modelName })
        .subscribe(result => {
          this.model = result.data;
        })
    );
  }

  public onClickTrainButton() {
    this.$trainingJob = this.modelService
      .trainModel({
        force: true,
        id: this.model.id,
        url: this.url
      })
      .pipe(map(result => result.data));
  }
}
