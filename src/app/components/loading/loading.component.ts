import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
  <div class="loading-container">
    <div class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
  `,
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {

}
