import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss']
})
export class RadioButtonComponent {

  @Input() radioText: string = 'defaultText';
  @Input() radioName: string = 'defaultName';
  @Input() radioId: string = 'defaultId';
  @Input() radioValue: string = 'defaultValue';
  @Input() radioChecked: boolean = false;
  @Input() radioDisabled: boolean = false;

}
