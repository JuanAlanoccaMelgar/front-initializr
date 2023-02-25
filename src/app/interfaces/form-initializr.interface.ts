import { AbstractControl } from "@angular/forms";

export interface FormInitilizr {
  project: AbstractControl<string>;
  type: AbstractControl<string>;
  language: AbstractControl<string>;
  bootVersion: AbstractControl<string>;
  domain: AbstractControl<string>;
  groupId: AbstractControl<string>;
  artifactId: AbstractControl<string>;
  name: AbstractControl<string>;
  description: AbstractControl<string>;
  packageName: AbstractControl<string>;
  packaging: AbstractControl<string>;
  javaVersion: AbstractControl<string>;
  dependencies: AbstractControl<any>;
  baseDir: AbstractControl<string>;
  version: AbstractControl<string>;
}
