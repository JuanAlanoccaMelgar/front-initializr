import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss']
})
export class InputTextComponent {

  @Input() inputLabel: string = 'defaultLabel';
  @Input() inputName: string = '';
  @Input() inputId: string = '';
  @Input() inputValue: string = '';
  @Input() inputPlaceholder: string = '';
  @Input() inputDisabled: boolean = false;

}
