import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UtilService } from './services/util.service';
import { DependencyGroup } from './model/dependencyGroup';
import { Dependency } from './model/dependency';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigurationResponse, ConfigurationResponseV2, DetailButton } from './interfaces/configuration-response.interface';
import { FormInitilizr } from './interfaces/form-initializr.interface';
import { delay } from 'rxjs';
import { ApiGateway } from './gateway/api.gateway';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  form: FormGroup<FormInitilizr>;
  modalSwitch: boolean = false;
  loading: boolean = false;
  listDependencies: DependencyGroup[] = [];
  selectedDependencies: Dependency[] = [];
  
  projectButtons: DetailButton[] = [];
  buildButtons: DetailButton[] = [];
  languageButtons: DetailButton[] = [];
  bootVersionButtons: DetailButton[] = [];
  domainsButtons: DetailButton[] = [];
  packagingButtons: DetailButton[] = [];
  javaVersionButtons: DetailButton[] = [];

  private _isLegacy: boolean = false;

  constructor(
    private utilService: UtilService,
    private api: ApiGateway,
    private fb: FormBuilder,
  ){
    this.form = this.fb.group<FormInitilizr>({
      project:      this.fb.control('', {validators: [Validators.required], nonNullable: true }),
      type:         this.fb.control('', {validators: [Validators.required], nonNullable: true }),
      language:     this.fb.control('', {validators: [Validators.required], nonNullable: true }),
      bootVersion:  this.fb.control('', {validators: [Validators.required], nonNullable: true }),
      domain:       this.fb.control('', {validators: [Validators.required], nonNullable: true }),
      packaging:    this.fb.control('', {validators: [Validators.required], nonNullable: true }),
      javaVersion:  this.fb.control('', {validators: [Validators.required], nonNullable: true }),
      groupId:      this.fb.control('', {validators: [Validators.required], nonNullable: true }),
      artifactId:   this.fb.control('', {validators: [Validators.required], nonNullable: true }),
      name:         this.fb.control('', {validators: [Validators.required], nonNullable: true }),
      description:  this.fb.control('', {validators: [Validators.required], nonNullable: true }),
      packageName:  this.fb.control('', {validators: [Validators.required], nonNullable: true }),
      baseDir:      this.fb.control('', {validators: [Validators.required], nonNullable: true }),
      version:      this.fb.control('', {validators: [Validators.required], nonNullable: true }),
      dependencies: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.utilService.modalCloseEvent$.subscribe(() => {
      this.modalSwitch = false;
    });
    this.utilService.modalSelectDependencyEvent$.subscribe((data: Dependency) => {
      this.selectedDependencies.push(data);
      const control = this.fb.control(data.id);
      const dependencyControl = this.form.get('dependencies') as FormArray;
      dependencyControl.push(control);
      this.modalSwitch = false;
    });
    this.api.getDependencies<any>().subscribe(data => {
      this.listDependencies = data;
    });
    this._isLegacy 
      ? this.loadConfigLegacy()
      : this.loadConfig();
  }
    
  ngAfterViewInit(): void {
    this.eventsForm();    
  }

  private loadConfigLegacy(): void{
    this.api.getConfig<any>().subscribe({
      next: (value) => {
        this.extractData(value.configurations);
        this.listDependencies = value.dependencies;
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  private loadConfig(): void {
    this.api.getConfigV2<ConfigurationResponseV2>()
      .pipe(delay(1000))
      .subscribe({
        next: (value) => {
          this.extractData(value.configurations);
          this.listDependencies = value.dependencies;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private extractData(data: ConfigurationResponse): void {
    const { 
      projects, 
      builds, 
      languages, 
      bootVersions, 
      domains,
      javaVersions,
      packaging,
      artifactId,
      description,
      groupId,
      name,
      packageName,
      version
    } = data;
    this.projectButtons = projects ?? [];
    this.buildButtons = builds ?? [];
    this.languageButtons = languages ?? [];
    this.bootVersionButtons = bootVersions ?? [];
    this.domainsButtons = domains ?? [];
    this.packagingButtons = packaging ?? [];
    this.javaVersionButtons = javaVersions ?? [];
    this.form.patchValue({
      artifactId,
      description,
      groupId,
      name,
      packageName,
      version,
      project: this.getValue(this.projectButtons),
      type: this.getValue(this.buildButtons),
      language: this.getValue(this.languageButtons),
      bootVersion: this.getValue(this.bootVersionButtons),
      domain: this.getValue(this.domainsButtons),
      packaging: this.getValue(this.packagingButtons),
      javaVersion: this.getValue(this.javaVersionButtons),
    }, { emitEvent: true, onlySelf: false });
    this.loading = false;
  }

  private eventsForm(): void {
    const projectControl = this.form.get('project');
    const typeControl = this.form.get('type');
    const bootVersionControl = this.form.get('bootVersion');
    const javaVersionControl = this.form.get('javaVersion');
    projectControl?.valueChanges.pipe(delay(100)).subscribe({
      next: (value) => {
        if (value === 'ginni') {
          typeControl?.disable();
          typeControl?.setValue('ginni-project');
          bootVersionControl?.disable();
          bootVersionControl?.setValue('2.2.11-RELEASE');
          javaVersionControl?.disable();
          javaVersionControl?.setValue('1.8');
          
        } else {
          typeControl?.enable();
          typeControl?.setValue('gradle-project');
          bootVersionControl?.enable();
          javaVersionControl?.enable();
          this.buildButtons
            .filter(rb => rb.esGinni)
            .forEach(rb => rb.disabled = true);
        }
      },
    });
  }

  private getValue(detail: DetailButton[]): string {
    return detail.filter(val => val.checked)
      .map(val => val.id)?.[0] ?? '';
  }

  openModal() {
    this.modalSwitch = true;
  }

  onGenerateProject() {
    console.log(this.form);
    console.log(this.form.value);
    // this.form.baseDir = this.form.name;
    // this.form.dependencies = this.selectedDependencies.map(d => d.id);
    // let action = '';
    // this.builds.forEach(b => {
    //   if (b.id == this.form.type) {
    //     action = b.action;
    //   }
    // });
    // this.api.postGenerateProject(this.form, action).subscribe(data => {
    //   console.log(data);
    // });
  }

  onRemoveDependency(dependency: Dependency, i: number) {
    this.selectedDependencies.splice(i,1);
    const dependencyControl = this.form.get('dependencies') as FormArray;
    dependencyControl.removeAt(i);
    this.listDependencies.forEach((g: DependencyGroup) => {
      if (dependency.group == g.name) {
        g.content.forEach((d: Dependency) => {
          if (dependency.name == d.name) {
            dependency.hidden = false;
            g.hidden= false;
          }
          return;
        });
        return;
      }
    });
  }
}
