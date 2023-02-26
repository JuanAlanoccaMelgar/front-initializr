import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DetailButton } from 'src/app/interfaces/configuration-response.interface';
import { RadioGroupButtonComponent } from '../radio-group-button/radio-group-button.component';

@Component({
  selector: 'app-radio-button',
  template: `
    <div class="radio-button" 
      [ngClass]="{disabled: radioButton.disabled}"
      (click)="radioButton.disabled ? null : clickButton()">
      <input type="radio" class="radio" 
        [checked]="radioButton.checked" 
        [disabled]="radioButton.disabled"
        >
      <span class="checkmark"></span>
      <label class="radio-label">
        {{ radioButton.name }}
      </label>
    </div>
  `,
  styleUrls: ['./radio-button.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true,
    }
  ],
})
export class RadioButtonComponent implements ControlValueAccessor {
  
  @Input()
  radioButton!: DetailButton;

  constructor(private rgbComponent: RadioGroupButtonComponent) {}

  onChangeCb?: (_: any) => void;
  onTouchedCb?: () => void;
  
  writeValue(active: boolean): void {
    this.radioButton.checked = active;
  }
  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
  }
  registerOnTouched(fn: any): void {
   this.onTouchedCb = fn;
  }
  setDisabledState(isDisabled: boolean) {
    this.radioButton.disabled = isDisabled;
  }
  clickButton() {
    this.onChangeCb?.(this.radioButton.id);
    this.rgbComponent?.clickRadioButton(this.radioButton.id);
  }
}
