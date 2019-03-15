import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  onSubmit() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    if (!email || !password) {
      console.log('Incomplete credentials!');
      return;
    }

    this.authService.logIn({
      strategy: 'local',
      email,
      password
    }) // navigate to base URL on success
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch(err => {
        console.log('Wrong credentials!', err);
        alert('As credenciais estão erradas. Corrija ou contacte o administrador.');
      });

  }

}
