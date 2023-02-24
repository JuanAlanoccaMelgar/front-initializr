import { Component, Input } from '@angular/core';
import { Dependency } from 'src/app/model/dependency';
import { DependencyGroup } from 'src/app/model/dependencyGroup';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  @Input() dependencies: DependencyGroup[] = [];

  constructor(
    private utilService: UtilService
  ) {}

  emitCloseModal() {
    this.utilService.modalCloseEvent$.emit();
  }

  selectDependency(dependency: Dependency) {
    dependency.hidden = true;
    this.validHiddenGroup(dependency.group);
    this.utilService.modalSelectDependencyEvent$.emit(dependency);
  }

  validHiddenGroup(group: string) {
    this.dependencies.forEach((g: DependencyGroup) => {
      if (group == g.name) {
        if (g.content.every((d: Dependency) => d.hidden == true )) {
          g.hidden = true;
        }
        return;
      }
    });
  }

  formatVersionRange(versionRange: string) {
    const range = versionRange.split(",");
    if (range.length > 2) {
      let firstRange = '';
      if (range[0].includes('[')) {
        firstRange = range[0].replace("[", ">= ");
      }
      if (range[0].includes('(')) {
        firstRange = range[0].replace("(", "> ");
      }

      let lastRange = '';
      if (range[0].includes(']')) {
        lastRange = range[0].replace("]", "<= ");
      }
      if (range[0].includes(')')) {
        lastRange = range[0].replace(")", "< ");
      }
      return `${firstRange} and ${lastRange}`;
    } else {
      let vRange = '';
      if (range[0].includes('[')) {
        vRange = range[0].replace("[", ">= ");
      }
      if (range[0].includes('(')) {
        vRange = range[0].replace("(", "> ");
      }
      if (range[0].includes(']')) {
        vRange = range[0].replace("]", "<= ");
      }
      if (range[0].includes(')')) {
        vRange = range[0].replace(")", "< ");
      }
      if (!range[0].match(/\[|\(|\]|\)/g)) {
        vRange = `>= ${range[0]}`;
      }
      return `${vRange}`;
    }

  }

}
