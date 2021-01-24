import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { ClrLoadingState } from '@clr/angular';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AuthService } from 'src/app/shared';

@AutoUnsubscribe()
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements AfterViewInit, OnDestroy {

  public loading = false;
  public submitBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
  public currentYear = new Date().getFullYear();

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  onSubmit() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    if (!email || !password) {
      console.log('Incomplete credentials!');
      return;
    }

    this.submitBtnState = ClrLoadingState.LOADING;

    this.authService.logIn({
      strategy: 'local',
      email,
      password
    }) // navigate to base URL on success
      .then(() => {
        this.submitBtnState = ClrLoadingState.DEFAULT;
        this.router.navigate(['/']);
      })
      .catch(err => {
        this.submitBtnState = ClrLoadingState.DEFAULT;
        console.log('Erro:', err);
        if (err.message && err.message === 'Invalid login') {
          alert('As credenciais estão erradas');
          return;
        }
        alert('Problema na conexão. Contacte o administrador.');
      });

  }

}
