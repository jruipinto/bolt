import { Directive, OnInit, Input } from '@angular/core';
import { UIService } from '../state';
import { FormGroupDirective } from '@angular/forms';

@Directive({
  selector: '[formState]'
})
export class FormStateDirective implements OnInit {

  @Input('formState')
  // tslint:disable-next-line: no-non-null-assertion
  path: string = null!;

  constructor(
    private uiService: UIService,
    private formGroupDirective: FormGroupDirective
  ) { }

  ngOnInit() {
    console.log('formulario:', this.formGroupDirective.form);
  }

}
