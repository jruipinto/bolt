import { Directive, HostListener, Renderer2, ElementRef } from '@angular/core';
import { capitalize } from 'src/app/shared/utilities';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[autocaps]'
})
export class AutocapsDirective {

  @HostListener('keyup', ['$event'])
  onKeyDown(evt) {
    const format = (input) => {
      const reducer1 = (accumulator, currentValue) => accumulator + '. ' + capitalize(currentValue);
      const reducer2 = (accumulator, currentValue) => accumulator + '\r\n' + capitalize(currentValue);
      const reducer3 = (accumulator, currentValue) => accumulator + '\r' + capitalize(currentValue);
      const reducer4 = (accumulator, currentValue) => accumulator + '\n' + capitalize(currentValue);
      const inp = capitalize(input);
      return inp
        .split('. ')
        .reduce(reducer1)
        .split('\r\n')
        .reduce(reducer2)
        .split('\r')
        .reduce(reducer3)
        .split('\n')
        .reduce(reducer4);
    };
    this.renderer.setProperty(this.el.nativeElement, 'value', format(evt.target.value));
  }

  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

}
