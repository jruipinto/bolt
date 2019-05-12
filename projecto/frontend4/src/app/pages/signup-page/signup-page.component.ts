import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { DataService } from 'src/app/shared';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {
  signupForm = this.fb.group({
    nome: [null, Validators.required],
    contacto: [null, [Validators.required, Validators.min(200000000), Validators.max(999999999999)]],
    email: [null],
    password: [null],
    endereço: [null],
    nif: [null],
    tipo: [null, Validators.required]
  });

  constructor(private fb: FormBuilder, private dataService: DataService) { }

  ngOnInit() {
  }

  onSubmit() {
    // this.dataService.create$('users', {nome, contacto, email, password, endereço, nif, tipo});
    this.dataService.create$('users', this.signupForm.value);
  }

}
