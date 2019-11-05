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
      const inp = capitalize(input);
      const phrases = inp.split('. ');
      const reducer = (accumulator, currentValue) => accumulator + '. ' + capitalize(currentValue);
      return phrases.reduce(reducer);
    };
    this.renderer.setProperty(this.el.nativeElement, 'value', format(evt.target.value));
  }

  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

}
