import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FeathersService } from '../shared/services/feathers.service';
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

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.loginForm.value);
    console.log(this.loginForm.value.email);
    console.log(this.loginForm.value.password);

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    if (!email || !password) {
      console.log('Incomplete credentials!');
      return;
    }
    /*
    // try to authenticate with feathers
    this.feathersService.authenticate({
      strategy: 'local',
      email,
      password
    })
      // navigate to base URL on success
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch(err => {
        console.log('Wrong credentials!');
      });
      */
     this.authService.logIn({
      strategy: 'local',
      email,
      password
    }) // navigate to base URL on success
    .then(() => {
      this.router.navigate(['/']);
    })
    .catch(err => {
      console.log('Wrong credentials!');
    });

  }

}
