import { FocusMonitor } from '@angular/cdk/a11y';
import { Directive, AfterViewInit, ElementRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[autofocus]',
})
export class AutofocusDirective implements AfterViewInit {
  constructor(
    private el: ElementRef<HTMLElement>,
    private focusMonitor: FocusMonitor
  ) {}

  ngAfterViewInit() {
    setTimeout(
      () => this.focusMonitor.focusVia(this.el.nativeElement, 'program'),
      0.1
    );
  }
}
