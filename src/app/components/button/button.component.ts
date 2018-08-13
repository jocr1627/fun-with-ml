import { Component, Input } from '@angular/core';

@Component({
  selector: 'button-cmp',
  styleUrls: ['./button.component.scss'],
  templateUrl: './button.component.html'
})
export class ButtonComponent<T> {
  @Input()
  disabled: boolean = false;
  @Input()
  iconShape: string = null;
  @Input()
  label: string = null;
}
