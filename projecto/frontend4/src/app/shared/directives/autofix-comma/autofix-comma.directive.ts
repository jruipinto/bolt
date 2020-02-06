import { Directive, HostListener, Renderer2, ElementRef } from '@angular/core';
import { capitalize } from '../..';

@Directive({
  selector: '[appAutofixComma]'
})
export class AutofixCommaDirective {

  @HostListener('keyup', ['$event'])
  onKeyDown(evt) {
    const format = (input: string) => input.replace('/./gi', ',');
    this.renderer.setProperty(this.el.nativeElement, 'value', format(evt.target.value));
  }

  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

}
