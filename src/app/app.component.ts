import { Component } from '@angular/core';
import { Model } from 'fun-with-ml-schema';
import { Observable } from 'rxjs';
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
  public model: Model = null;
  public modelAccessors: DropdownValueAccessors<Model> = {
    text: model => model && model.name
  };

  constructor(private modelService: ModelService) {
    this.$models = this.modelService.models().pipe(map(result => result.data));
  }
}
