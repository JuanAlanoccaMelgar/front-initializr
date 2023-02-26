import { Pipe, PipeTransform } from '@angular/core';
import { Content } from '../interfaces';
import { compare } from '../utils';

@Pipe({
  name: 'rangeVersionContent',
  pure: false,
})
export class RangeVersionContentPipe implements PipeTransform {

  transform(contents: Content[], bootVersion: string | undefined): Content[] {
    const conts = contents.map(content => {
      content.versionRequired = compare(content.versionRange, bootVersion);
      return {
        ...content,
      };
    });
    return conts;
  }
}
