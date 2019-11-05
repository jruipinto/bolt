import { Directive, AfterViewInit } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { map, tap } from 'rxjs/operators';
import { capitalize } from 'src/app/shared/utilities';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[formCapitalize]'
})
export class FormCapitalizeDirective implements AfterViewInit {

  constructor(private formGroupDirective: FormGroupDirective) { }

  ngAfterViewInit() {
    const form = this.formGroupDirective.control;
    form.valueChanges
      .pipe(
        map((input) => {
          const phrases = input.split('. ');
          const reducer = (accumulator, currentValue) => accumulator + capitalize(currentValue);
          return phrases.reduce(reducer);
        }),
        tap((input) => form.patchValue(input, { emitEvent: false }))
      )
      .subscribe();
  }

}
