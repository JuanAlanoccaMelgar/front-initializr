import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { InitializrForm } from '../model/formBuild';
import { ApiGateway } from '../gateway/api.gateway';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitializrService implements ApiGateway {
  private readonly url = environment.urlServer;
  private http = inject(HttpClient);

  getConfig<T>() {
    const endpoint = `${this.url}/metadata/configurations`
    return this.http.get<T>(endpoint);
  }

  getDependencies<T>() {
    const endpoint = `${this.url}/metadata/dependencies`;
    return this.http.get<T>(endpoint);
  }

  getConfigV2<T>() {
    const endpoint = `${this.url}/metadata/v2/configurations`;
    return this.http.get<T>(endpoint);
  }

  postGenerate<T>(form: InitializrForm, action: string) {
    const enpoint = `${this.url}/build${action}`;
    return this.http.post<T>(enpoint, form, {
      responseType: 'blob' as 'json',
      observe: 'response',
    }).pipe(
      map((response: HttpResponse<any>) => {
        const element = document.createElement('a');
        element.href = window.URL.createObjectURL(response.body);
        const name = 
          response?.headers?.get('content-disposition')?.substring(21).replace(/\"/g, '') 
          ?? form.name;
        element.download = name;
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        return response as any;
      })
    );
  }
}
