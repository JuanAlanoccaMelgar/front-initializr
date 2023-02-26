import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Content, IDependency } from 'src/app/interfaces';
import { Dependency } from 'src/app/model/dependency';
import { DependencyGroup } from 'src/app/model/dependencyGroup';
import { UtilService } from 'src/app/services/util.service';
import { compareVersion, parseVersion } from 'src/app/utils';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  filterValue?: string;
  private keyDownCtrl: boolean = false;
  
  @Input()
  dependencies: IDependency[] = [];

  @Output()
  dependenciesChange = new EventEmitter<IDependency[]>();

  @Input()
  bootVersion?: string;

  @HostListener('document:keydown', ['$event'])
  onKeyDown = ($event: KeyboardEvent) => {
    if ($event.key === 'Control')
      this.keyDownCtrl = true;
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp = () => {
    this.keyDownCtrl = false;
  }

  constructor(
    private utilService: UtilService
  ) {}

  emitCloseModal() {
    this.utilService.modalCloseEvent$.emit();
  }

  selectDependency(content: Content) {
    this.dependencies = this.dependencies.map(dep => {
      const con = dep.content.map(con => {
        if (con.id === content.id) {
          con.hidden = true;
          this.utilService.modalSelectDependencyEvent$.emit(content);
          this.validHiddenGroup(content.group);
        }
        return con;
      })
      return {
        ...dep,
        content: con,
      }
    }
    )
    this.dependenciesChange.emit(this.dependencies);
    if (!this.keyDownCtrl) {
      this.utilService.modalCloseEvent$.emit();
    }
  }

  validHiddenGroup(group: string) {
    this.dependencies.forEach((g: DependencyGroup) => {
      if (group === g.name) {
        if (g.content.every((d: Dependency) => d.hidden == true)) {
          g.hidden = true;
        }
        return;
      }
    });
  }

  formatVersionRange(versionRange: string) {
    console.log(versionRange);
    if (!this.bootVersion || !versionRange)  return;
    const boot = this.bootVersion.replace(/([A-Z-])\w+/g, '');
    const range = versionRange.split(',');
    
    if (range.length > 1) {
      let firstRange = '';
      const num1 = parseVersion(versionRange.split(',')[0]);
      const num2 = parseVersion(versionRange.split(',')[1]);
      if (range[0].includes('[')) {
        firstRange = range[0].replace('[', '>= ');
      }
      if (range[0].includes('(')) {
        firstRange = range[0].replace('(', '> ');
      }

      let lastRange = '';
      if (range[1].includes(']')) {
        lastRange = `<= ${range[1].replace(']', '')}`;
      }
      if (range[1].includes(')')) {
        lastRange = `< ${range[1].replace(')', '')}`;
      }
      if (compareVersion(boot, num1) > 0 && compareVersion(boot, num2) < 0 ){
        return false;
      } else {
        return `${firstRange} and ${lastRange}`;
      }
    } else {
      let vRange = '';
      const num1 = parseVersion(versionRange.split(',')[0]);
      if (range[0].includes('[')) {
        vRange = range[0].replace('[', '>= ');
      }
      if (range[0].includes('(')) {
        vRange = range[0].replace('(', '> ');
      }
      if (range[0].includes(']')) {
        vRange = range[0].replace(']', '<= ');
      }
      if (range[0].includes(')')) {
        vRange = range[0].replace(')', '< ');
      }
      if (!range[0].match(/\[|\(|\]|\)/g)) {
        vRange = `>= ${range[0]}`;
      }
      if (compareVersion(boot, num1) > 0 ){
        return false;
      } else {
        return `${vRange}`;
      }
    }

  }

}
