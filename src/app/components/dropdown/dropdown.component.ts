import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownValueAccessors } from './models';

@Component({
  selector: 'dropdown',
  styleUrls: ['./dropdown.component.scss'],
  templateUrl: './dropdown.component.html'
})
export class DropdownComponent<T> {
  @Input()
  accessors: DropdownValueAccessors<T> = {};
  @Input()
  disabled: boolean = false;
  @Input()
  selectedValue: T = null;
  @Input()
  values: T[] = [];
  @Output()
  selectedValueChange: EventEmitter<T> = new EventEmitter();

  public getText(value: T): string {
    return this.accessors.text
      ? this.accessors.text(value)
      : value && value.toString();
  }

  public select(value: T) {
    this.selectedValue = value;
    this.selectedValueChange.emit(this.selectedValue);
  }
}
