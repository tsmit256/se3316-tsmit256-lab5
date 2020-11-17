import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  loading = false;
  loginSubmitted = false;
  regSubmitted = false;
  returnUrl: string;
  loginError = '';
  registerError = '';

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService
  ) { 
      // redirect to home if already logged in
      if (this.authenticationService.currentUserValue) { 
          this.router.navigate(['/']);
      }
  }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
          email: ['', Validators.required],
          password: ['', Validators.required]
      });

      this.registerForm = this.formBuilder.group({
          name: ['', Validators.required],
          email: ['', Validators.required],
          password: ['', Validators.required]
      })

      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }
  get rf() { return this.registerForm.controls; }

  onLoginSubmit() {
      this.loginSubmitted = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }

      this.loading = true;
      let result = this.authenticationService.login(this.f.email.value, this.f.password.value);

      if(result){ //Don't continue if it doesn't return a value
        result.subscribe(
            data => {
                this.router.navigate([this.returnUrl]);
            },
            error => {
                alert(error);
                this.loginError = error;
                this.loading = false;
            });
      }
      else{
        this.loading = false;
      }  
  }

  onRegisterSubmit() {
    this.regSubmitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    this.loading = true;
    let result = this.authenticationService.createUserAccnt(this.rf.name.value, this.rf.email.value, this.rf.password.value);

    if(result){ //Don't continue if it doesn't return a value
      result.subscribe(
          data => {
              this.router.navigate([this.returnUrl]);
          },
          error => {
              this.registerError = error;
              this.loading = false;
          });
    }
    else{
      this.loading = false;
    }  
}
}
