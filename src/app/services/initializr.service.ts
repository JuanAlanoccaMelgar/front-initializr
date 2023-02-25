import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { InitializrForm } from '../model/formBuild';
import { ApiGateway } from '../gateway/api.gateway';

@Injectable({
  providedIn: 'root'
})
export class InitializrService implements ApiGateway {
  private apiUrl: string = environment.urlServer;
  
  constructor(
    private http: HttpClient
  ) { }

  getConfig<T>() {
    return this.http.get<T>(`${this.apiUrl}/metadata/configurations`);
  }

  getDependencies<T>() {
    return this.http.get<T>(`${this.apiUrl}/metadata/dependencies`);
  }

  getConfigV2<T>() {
    return this.http.get<T>(`${this.apiUrl}/metadata/v2/configurations`);
  }

  postGenerate<T>(form: InitializrForm, action: string) {
    const urlGenerate = `${this.apiUrl}/build${action}`;
    return this.http.post<T>(urlGenerate, form);
  }
}
