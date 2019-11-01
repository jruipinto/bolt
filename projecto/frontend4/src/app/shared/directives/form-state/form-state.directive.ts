import { Directive, OnChanges, Input } from '@angular/core';
import { UIService } from '../../state';
import { FormGroupDirective } from '@angular/forms';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[formState]'
})
export class FormStateDirective implements OnChanges {

  @Input('formState')
  // tslint:disable-next-line: no-non-null-assertion
  path: string = null!;

  constructor(
    private uiService: UIService,
    private formGroupDirective: FormGroupDirective
  ) { }

  ngOnChanges() {
    const form = this.formGroupDirective.control;
    console.log('formulario:', form.value, this.path);
  }

}
