import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SocialAuthService } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
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
  verifyLink: string;
  googleUser: SocialUser;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private googleAuthService: SocialAuthService
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

      this.verifyLink = '';

      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

      this.googleAuthService.authState.subscribe((user) => {
        this.googleUser = user;
      });
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
              this.verifyLink = window.location.host + '/verification/' + data.link;
              this.loading = false;
              alert(`Email Template:\nfrom: 'Do Not Reply <webtechlab5@gmail.com>',\nsubject: 'Please confirm account',\nhtml: 'Click the following link to confirm your account</p><p>${this.verifyLink}<p>\ntext: 'Please confirm your account by clicking the following link: ${this.verifyLink}`);
          },
          error => { 
              alert(error);
              this.registerError = error;
              this.loading = false;
          });
    }
    else{
      this.loading = false;
    }  
  }


  signInWithGoogle(): void {
    this.googleAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
    .then((userData) => {
      //Send the google user token to server
      this.sendTokenToApi(userData.idToken);
    })
  }

  //send the google user token to server
  sendTokenToApi(token: string): void{
    this.authenticationService.sendGoogleTokenToApi(token)
    .subscribe(
        data => {
            this.router.navigate([this.returnUrl]);
        },
        error => {
            this.loginError = error;
            this.loading = false;
        }
    );
  }

}
