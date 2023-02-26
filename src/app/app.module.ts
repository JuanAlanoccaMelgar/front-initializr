import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RadioButtonComponent } from './components/radio-button/radio-button.component';
import { InputTextComponent } from './components/input-text/input-text.component';
import { ModalComponent } from './components/modal/modal.component';
import { ModalItemComponent } from './components/modal-item/modal-item.component';
import { LoadingComponent } from './components/loading/loading.component';
import { RadioGroupButtonComponent } from './components/radio-group-button/radio-group-button.component';
import { ApiGateway } from './gateway/api.gateway';
import { InitializrService } from './services/initializr.service';
import { RangeVersionDependencyPipe } from './pipes/range-version-dependency.pipe';
import { RangeVersionContentPipe } from './pipes/range-version-content.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RadioButtonComponent,
    InputTextComponent,
    ModalComponent,
    ModalItemComponent,
    LoadingComponent,
    RadioGroupButtonComponent,
    RangeVersionDependencyPipe,
    RangeVersionContentPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: ApiGateway, useClass: InitializrService,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
