import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { UtilService } from './services/util.service';
import { DependencyGroup } from './model/dependencyGroup';
import { Dependency } from './model/dependency';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigurationResponse, ConfigurationResponseV2, DetailButton } from './interfaces/configuration-response.interface';
import { FormInitilizr } from './interfaces/form-initializr.interface';
import { delay, distinctUntilChanged } from 'rxjs';
import { ApiGateway } from './gateway/api.gateway';
import { Content, IDependency } from './interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  form: FormGroup<FormInitilizr>;
  modalSwitch: boolean = false;
  loading: boolean = false;
  listDependencies: IDependency[] = [];
  selectedDependencies: Content[] = [];
  
  projectButtons: DetailButton[] = [];
  buildButtons: DetailButton[] = [];
  languageButtons: DetailButton[] = [];
  bootVersionButtons: DetailButton[] = [];
  domainsButtons: DetailButton[] = [];
  packagingButtons: DetailButton[] = [];
  javaVersionButtons: DetailButton[] = [];

  private _isLegacy: boolean = false;
  private api = inject(ApiGateway);
  private configuration!: ConfigurationResponse;
  private readonly groupGinniBase = 'com.pandero.ginni';
  private action?: string;

  constructor(
    private utilService: UtilService,
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
    this.utilService.modalSelectDependencyEvent$.subscribe((data: Content) => {
      this.selectedDependencies.push(data);
      const control = this.fb.control(data.id);
      const dependencyControl = this.form.get('dependencies') as FormArray;
      dependencyControl.push(control);
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
        this.configuration = value;
        this.loadInitialForm();
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.api.getDependencies<any>().subscribe({
      next: (value) => {
        this.listDependencies = value;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private loadConfig(): void {
    this.api.getConfigV2<ConfigurationResponseV2>()
      .pipe(delay(100))
      .subscribe({
        next: ({ configurations, dependencies }) => {
          this.listDependencies = dependencies;
          this.configuration = configurations;
          this.initialButtons();
          this.loadInitialForm();
          this.loading = false;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private initialButtons() {
    const { 
      projects, 
      builds, 
      languages, 
      bootVersions, 
      domains,
      javaVersions,
      packaging,
    } = this.configuration;
    this.projectButtons = projects ?? [];
    this.buildButtons = builds ?? [];
    this.languageButtons = languages ?? [];
    this.bootVersionButtons = bootVersions ?? [];
    this.domainsButtons = domains ?? [];
    this.packagingButtons = packaging ?? [];
    this.javaVersionButtons = javaVersions ?? [];
  }

  private loadInitialForm(): void {
    const { 
      artifactId,
      description,
      groupId,
      name,
      packageName,
      version
    } = this.configuration;
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
  }

  private eventsForm(): void {
    const projectControl = this.form.get('project');
    const typeControl = this.form.get('type');
    const bootVersionControl = this.form.get('bootVersion');
    const javaVersionControl = this.form.get('javaVersion');
    const languageControl = this.form.get('language');
    const packagingControl = this.form.get('packaging');
    const domainControl = this.form.get('domain');
    const groupIdControl = this.form.get('groupId');
    const artifactIdControl = this.form.get('artifactId');
    const nameControl = this.form.get('name');
    const packageNameControl = this.form.get('packageName');
    const baseDirControl = this.form.get('baseDir');

    projectControl?.valueChanges.pipe(
      delay(100), 
      distinctUntilChanged()
    ).subscribe({
      next: (value) => {
        if (value === 'ginni') {
          typeControl?.disable();
          bootVersionControl?.disable();
          javaVersionControl?.disable();
          languageControl?.disable();
          packagingControl?.disable();
          domainControl?.enable();
          groupIdControl?.disable();
          this.form.patchValue({
            type: 'ginni-project',
            bootVersion: '2.2.11-RELEASE',
            javaVersion: '1.8',
            language: 'java',
            packaging: 'jar',
            groupId: 'com.pandero.ginni'
          });
        } else {
          this.loadInitialForm();
          groupIdControl?.enable();
          typeControl?.enable();
          bootVersionControl?.enable();
          javaVersionControl?.enable();
          languageControl?.enable();
          packagingControl?.enable();
          domainControl?.disable();
          this.buildButtons
            .filter(rb => rb.esGinni)
            .forEach(rb => rb.disabled = true);
        }
      },
    });
    typeControl?.valueChanges.subscribe({
      next: (value) => {
        this.action = this.buildButtons.filter(bb=>bb.id === value)[0].action;
      },
    })

    domainControl?.valueChanges.subscribe({
      next: (value) => {
        if (projectControl?.value === 'ginni')
          groupIdControl?.setValue(`${this.groupGinniBase}.${value}`);
        else
          groupIdControl?.setValue(`${this.configuration.groupId}`)    
      }
    });
    groupIdControl?.valueChanges.subscribe({
      next: (value) => {
        packageNameControl?.setValue(`${ value }.${artifactIdControl?.value}`)  
      },
    });
    artifactIdControl?.valueChanges.subscribe({
      next: (value) => {
        packageNameControl?.setValue(`${groupIdControl?.value}.${value}`);
        nameControl?.setValue(`${value}`);
      },
    });
    nameControl?.valueChanges.subscribe({
      next: (value) => {
        baseDirControl?.setValue(value);
      },
    });
    bootVersionControl?.valueChanges.pipe(delay(100)).subscribe({
      next: () => {
        this.findDependency();
      },
    })
  }

  private getValue(detail: DetailButton[]): string {
    return detail.filter(val => val.def)
      .map(val => val.id)?.[0] ?? '';
  }

  openModal() {
    this.modalSwitch = true;
  }

  onGenerateProject() {
    if (this.action && this.form.valid)
      this.api.postGenerate(this.form.getRawValue(), this.action).subscribe();
  }

  onRemoveDependency(dependency: Content, i: number) {
    this.selectedDependencies.splice(i,1);
    const dependencyControl = this.form.get('dependencies') as FormArray;
    dependencyControl.removeAt(i);
    this.listDependencies.forEach((g: IDependency) => {
      if (dependency.group == g.name) {
        g.content.forEach((content: Content) => {
          if (dependency.id === content.id) {
            content.hidden = false;
            g.hidden= false;
          }
          return;
        });
        return;
      }
    });
  }
  private findDependency() {
    const dependencyControl = this.form.get('dependencies') as FormArray;
    dependencyControl.clear();
    this.selectedDependencies.forEach(content => {
      if (content.versionRequired === null) {
        const control = this.fb.control(content.id, content.versionRequired);
        dependencyControl.push(control);
      } 
    })
  }
}
