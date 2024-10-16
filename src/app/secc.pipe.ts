import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secc',
  standalone: true
})
export class SeccPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value !== 'number') {
      return value;
    }
    return new Date(value * 1000).toISOString().substring(14, 19)
  }

}
