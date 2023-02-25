import { Injectable, EventEmitter } from '@angular/core';
import { Dependency } from '../model/dependency';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  modalOpenEvent$ = new EventEmitter<string>();
  modalCloseEvent$ = new EventEmitter();
  modalSelectDependencyEvent$ = new EventEmitter<Dependency>();
}
