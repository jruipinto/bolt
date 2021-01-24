import { Directive, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { UIService, UI } from '../../state';
import { FormGroupDirective } from '@angular/forms';
import { first, concatMap, tap } from 'rxjs/operators';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[formState]'
})
export class FormStateDirective implements OnInit {

  @Input('formState')
  // tslint:disable-next-line: no-non-null-assertion
  path: string = null!;

  constructor(
    private uiService: UIService,
    private formGroupDirective: FormGroupDirective,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const form = this.formGroupDirective.control;

    this.uiService.state$
      .pipe(
        first(),
        tap((uiState: UI) => form.patchValue(uiState[this.path])),
        tap(() => this.cdr.detectChanges())
      ).subscribe();

    form.valueChanges
      .pipe(
        concatMap(
          (formValue) => this.uiService.patchState({ [this.path]: formValue })
        )
      )
      .subscribe();
  }

}
