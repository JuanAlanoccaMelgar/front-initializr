import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DetailButton } from 'src/app/interfaces/configuration-response.interface';

@Component({
  selector: 'app-radio-group-button',
  template: `
    <app-radio-button
      class="radio-group-button" 
      *ngFor="let radioButton of radioButtons" 
      [radioButton]="radioButton"
      >
    </app-radio-button>
  `,
  styleUrls: ['./radio-group-button.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupButtonComponent),
      multi: true,
    },
  ],
})
export class RadioGroupButtonComponent implements ControlValueAccessor {
  @Input()
  radioButtons: DetailButton[] = [];
  
  @Input()
  direction: 'vertical' | 'horizontal' = 'horizontal';

  @Input()
  reverse: boolean = false;

  onChangeCb?: (value: string) => void;
  onTouchedCb?: () => void = () => {};

  writeValue(value: string): void {
    this.radioButtons?.forEach(radioButton => {
      if (radioButton.id === value) radioButton.checked = true;
      else radioButton.checked = false;
    });
  }
  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }
  setDisabledState(isDisabled: boolean) {
    this.radioButtons?.forEach(val => val.disabled = isDisabled);
  }
  clickRadioButton(value: string): void {
    this.radioButtons?.forEach(radioButton => {
      if (radioButton.id === value) radioButton.checked = true;
      else radioButton.checked = false;
    });
    this.onChangeCb?.(value);
  }
}
