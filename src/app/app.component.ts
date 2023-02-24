import { Component, OnInit } from '@angular/core';
import { UtilService } from './services/util.service';
import { DependencyGroup } from './model/dependencyGroup';
import { InitializrService } from './services/initializr.service';
import { InitializrRadioButton } from './model/radioButton';
import { InitializrForm } from './model/formBuild';
import { Dependency } from './model/dependency';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  modalSwitch: boolean = false;
  loading: boolean = true;
  disableDomains: boolean = true;

  listDependencies: DependencyGroup[] = [];
  selectedDependencies: Dependency[] = [];
  configs: any;

  projects: InitializrRadioButton[] = [];
  builds: InitializrRadioButton[] = [];
  domains: InitializrRadioButton[] = [];
  bootVersions: InitializrRadioButton[] = [];
  languages: InitializrRadioButton[] = [];
  packagings: InitializrRadioButton[] = [];
  javaVersions: InitializrRadioButton[] = [];

  isLegacy = false;

  form: InitializrForm = new InitializrForm;

  groupIdState: string = "";
  groupDefault: string = "";
  artifactDefault: string = "";

  constructor(
    private utilService: UtilService,
    private initializrService: InitializrService
  ){}

  ngOnInit(): void {
    this.utilService.modalCloseEvent$.subscribe(() => {
      this.modalSwitch = false;
    });

    this.utilService.modalSelectDependencyEvent$.subscribe((data: Dependency) => {
      this.selectedDependencies.push(data);
      this.modalSwitch = false;
    });

    if (!this.isLegacy) {
      this.initializrService.getAllConfigurations().subscribe(data => {
        this.listDependencies = data.dependencies;
        this.configs = data.configurations;
        this.loading = false;
        this.loadFirstStateForm(data.configurations);
      });
    } else {
      this.initializrService.getDependencies().subscribe(data => {
        this.listDependencies = data;
      });

      this.initializrService.getConfigs().subscribe(data => {
        this.configs = data;
        this.loading = false;
        this.loadFirstStateForm(data);

      });
    }

  }

  openModal() {
    this.modalSwitch = true;
  }

  onGenerateProject() {
    console.log(this.form);

    this.form.baseDir = this.form.name;
    this.form.dependencies = this.selectedDependencies.map(d => d.id);
    let action = '';
    this.builds.forEach(b => {
      if (b.id == this.form.type) {
        action = b.action;
      }
    });
    this.initializrService.postGenerateProject(this.form, action).subscribe(data => {
      console.log(data);

    });

  }

  onRemoveDependency(dependency: Dependency, i: any) {
    this.selectedDependencies.splice(i,1);
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

  loadFirstStateForm(data: any) {
    this.projects = data.projects;
    this.builds = data.builds;
    this.languages = data.languages;
    this.bootVersions = data.bootVersions;
    this.packagings = data.packaging;
    this.javaVersions = data.javaVersions;
    this.domains = data.domains;

    this.domains.forEach((element:any) => {
      element.disabled = true;
    })

    this.setDefaultArrayValuesFromFirstCall();

    this.form.groupId = data.groupId;
    this.form.artifactId = data.artifactId;
    this.form.name = data.name;
    this.form.description = data.description;
    this.form.packageName = data.packageName;
    this.form.version = data.version;

    this.form.packageName = `${data.packageName}.${data.artifactId}`;


    this.form.project = data.projects.filter((i:any) => i.checked === true)[0].id;
    this.form.language = data.languages.filter((i:any) => i.checked === true)[0].id;
    this.form.bootVersion = data.bootVersions.filter((i:any) => i.checked === true)[0].id;
    this.form.packaging = data.packaging.filter((i:any) => i.checked === true)[0].id;
    this.form.javaVersion = data.javaVersions.filter((i:any) => i.checked === true)[0].id;
    this.form.type = data.builds.filter((i:any) => i.checked === true)[0].id;

    this.groupIdState = this.form.groupId;
    this.groupDefault = this.form.groupId;
    this.artifactDefault = this.form.artifactId;

    /* Bloquear Ginni Project */
    this.builds.forEach((element:any) => {
      if (element.esGinni) {
        element.disabled = true;
      }
    });
  }

  radioProjectChange($event: any) {
    if ($event.target.value == 'generic') {

      this.form.groupId = this.groupDefault;
      this.form.packageName = `${this.groupDefault}.${this.form.artifactId}`;


      this.domains.forEach((element:any) => {
        element.disabled = true;
      });
      this.form.domain = "";


      this.builds.forEach((element:any) => {

        if (element.def) {
          element.checked = true;
          this.form.type = element.id;
        } else {
          element.checked = false;
        }
        if (element.esGinni) {
          element.disabled = true;
        } else {
          element.disabled = false;
        }
      });

      this.packagings.forEach((element:any) => {
        if (element.def) {
          element.checked = true;
          this.form.packaging = element.id;
        } else {
          element.checked = false;
        }
        element.disabled= false;
      });

      this.languages.forEach((element:any) => {
        if (element.def) {
          element.checked = true;
          this.form.language = element.id;
        } else {
          element.checked = false;
        }
        element.disabled= false;
      });

      this.javaVersions.forEach((element:any) => {
        if (element.def) {
          element.checked = true;
          this.form.javaVersion = element.id;
        } else {
          element.checked = false;
        }
        element.disabled= false;
      });

      this.bootVersions.forEach((element:any) => {
        if (element.def) {
          element.checked = true;
          this.form.bootVersion = element.id;
        } else {
          element.checked = false;
        }
        element.disabled= false;
      });

    }

    if ($event.target.value == "ginni") {

      this.domains.forEach((element:any) => {
        element.disabled = false;
      })

      this.form.groupId = `${this.form.groupId}.ginni`;
      this.form.packageName = `${this.form.groupId}.${this.form.artifactId}`;

      this.builds.forEach((element:any) => {
        if (element.esGinni) {
          element.checked = true;
          element.disabled = false;
          this.form.type = element.id;
        } else {
          element.checked = false;
          element.disabled = true;
        }
      });

      this.languages.forEach((element:any) => {
        if (element.esGinni) {
          element.checked = true;
          this.form.language = element.id;
        } else {
          element.checked = false;
          element.disabled = true;
        }
      });

      this.javaVersions.forEach((element:any) => {
        if (element.esGinni) {
          element.checked = true;
          this.form.javaVersion = element.id;
        } else {
          element.checked = false;
          element.disabled = true;
        }
      });

      this.bootVersions.forEach((element:any) => {
        if (element.esGinni) {
          element.checked = true;
          this.form.bootVersion = element.id;
        } else {
          element.checked = false;
          element.disabled = true;
        }
      });

      this.packagings.forEach((element:any) => {
        if (element.esGinni) {
          element.checked = true;
          this.form.packaging = element.id;
        } else {
          element.checked = false;
          element.disabled = true;
        }
      });

    }

  }

  inputTextGroupChange(value: any) {
    this.groupIdState = value;
    this.form.packageName = `${value}.${this.form.artifactId}`;
  }

  inputTextArtifactChange(value: any) {
    this.form.packageName = `${this.form.groupId}.${value}`;
    this.form.name = value;
  }

  radioDomainChangePackage(value: any) {
    if (value === 'core') {
      value = "fondocolectivo"
    }
    this.form.groupId = `${this.groupIdState}.ginni.${value}`;
    this.form.packageName = `${this.form.groupId}.${this.form.artifactId}`;
  }

  radioDomainsChange(e: any) {
    this.domains.forEach(element => {
      if (element.id === e.value) {
        element.checked = true;
      } else {
        element.checked = false;
      }
    });
  }

  setDefaultArrayValuesFromFirstCall() {
    this.projects.forEach( i => {
      if (i.def) {
        this.form.project = i.id;
      }
    });
    this.builds.forEach( i => {
      if (i.def) {
        this.form.type = i.id;
      }
      if (i.esGinni) {
        i.disabled = true;
      }
    });
    this.domains.forEach( i => {
      if (i.def) {
        this.form.domain = i.id;
      }
    });
    this.bootVersions.forEach( i => {
      if (i.def) {
        this.form.bootVersion = i.id;
      }
    });
    this.languages.forEach( i => {
      if (i.def) {
        this.form.language = i.id;
      }
    });
    this.packagings.forEach( i => {
      if (i.def) {
        this.form.packaging = i.id;
      }
    });
    this.javaVersions.forEach( i => {
      if (i.def) {
        this.form.javaVersion = i.id;
      }
    });
  }

}
