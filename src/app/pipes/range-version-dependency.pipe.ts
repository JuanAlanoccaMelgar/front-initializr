import { Pipe, PipeTransform } from '@angular/core';
import { IDependency } from '../interfaces';
import { compare } from '../utils';

@Pipe({
  name: 'rangeVersionDepenedency'
})
export class RangeVersionDependencyPipe implements PipeTransform {

  transform(dependencies: IDependency[], bootVersion: string | undefined, filter?: string): IDependency[] {
    return dependencies.map( dependency => {
      const content = dependency.content.map(content => {
        content.versionRequired = compare(content.versionRange, bootVersion);
        let hidden = undefined;
        let description = undefined;
        let name = undefined;
        if (filter) {
          const FILTER = filter.toLowerCase();
          description = content.description.toLowerCase().includes(FILTER);
          name = content.name.toLowerCase().includes(FILTER);
          hidden = name ? false : description ? false : true;
        } else {
          hidden = content.hidden;
        }
        return {
          ...content,
          hidden: hidden,
        };
      });

      return {
        ...dependency,
        content,
      }
    });
  }

  

}
