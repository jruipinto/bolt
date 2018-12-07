import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {
  signupForm = this.fb.group({
    nome: ['', Validators.required],
    contacto: ['', [Validators.required, Validators.min(200000000), Validators.max(999999999999)]],
    email: [''],
    password: [''],
    endereco: [null],
    nif: [null],
    tipo: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private dataService: DataService) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.signupForm.value);
    console.log(this.signupForm.value.email);
    console.log(this.signupForm.value.password);
    console.log(this.signupForm.value.nome);
    console.log(this.signupForm.value.tipo);

    const nome: string = this.signupForm.value.nome;
    const contacto: number = this.signupForm.value.contacto;
    const email: string = this.signupForm.value.email;
    const password: string = this.signupForm.value.password;
    const endereco: string = this.signupForm.value.endereco;
    const nif: number = this.signupForm.value.nif;
    const tipo: string = this.signupForm.value.tipo;

    // this.dataService.create$('users', {nome, contacto, email, password, endereco, nif, tipo});
    this.dataService.create$('users', this.signupForm.value);
  }

}
