import { Observable } from "rxjs";

export abstract class ApiGateway {
  abstract getConfig<T>(): Observable<T>;
  abstract getDependencies<T>(): Observable<T>;
  abstract getConfigV2<T>(): Observable<T>;
  abstract postGenerate<T>(request: any, action: string): Observable<T>;
}