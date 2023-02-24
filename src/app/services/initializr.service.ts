import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DependencyGroup } from '../model/dependencyGroup';
import { environment } from 'src/environments/environment.development';
import { InitializrForm } from '../model/formBuild';

@Injectable({
  providedIn: 'root'
})
export class InitializrService {

  private apiUrl: string = environment.urlServer;

  constructor(
    private http: HttpClient
  ) { }

  getConfigs() {
    return this.http.get<any>(`${this.apiUrl}/metadata/configurations`);
  }

  getDependencies() {
    return this.http.get<DependencyGroup[]>(`${this.apiUrl}/metadata/dependencies`);
  }

  getAllConfigurations() {
    return this.http.get<any>(`${this.apiUrl}/metadata/v2/configurations`);
  }

  postGenerateProject(form: InitializrForm, action: string) {
    const urlGenerate = `${this.apiUrl}/build${action}`;
    return this.http.post<any>(urlGenerate, form);
  }
}
