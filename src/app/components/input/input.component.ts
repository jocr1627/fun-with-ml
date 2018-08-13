import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { InputType } from './models/index';

const validators = {
  [InputType.Number]: (value: string) => {
    const numericValue = parseFloat(value);

    return isNaN(numericValue) ? null : numericValue;
  },
  [InputType.Text]: (value: string) => value
};

@Component({
  selector: 'input-cmp',
  styleUrls: ['./input.component.scss'],
  templateUrl: './input.component.html'
})
export class InputComponent<T> {
  @Input()
  autoFocus: boolean = false;
  @Input()
  error: string = null;
  @Input()
  iconShape: string = null;
  @Input()
  placeholder: string = '';
  @Input()
  readOnly: boolean = false;
  @Input()
  type: InputType = InputType.Text;
  @Input()
  value: T = null;
  @Output()
  blur: EventEmitter<Event> = new EventEmitter();
  @Output()
  valueChange: EventEmitter<T> = new EventEmitter();

  constructor(private el: ElementRef) {}

  public focus() {
    const nativeElement: HTMLElement = this.el.nativeElement;
    const input: HTMLElement = nativeElement.querySelector('.input');

    input.focus();
  }

  public onChange(value: string) {
    this.value = this.validate(value);
    this.valueChange.emit(this.value);
  }

  public validate(value: string): T {
    return validators[this.type](value) as any;
  }
}
