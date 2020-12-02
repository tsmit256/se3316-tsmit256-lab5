import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models/user';
import { ValidateService } from './validate.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient, 
                private validateService: ValidateService) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };

    login(email: string, password: string) {
        if(!this.validateService.isValidEmail(email) || !this.validateService.isValidPassword(password)){
          return;
        }
        return this.http.post<any>(`api/open/users/authenticate`, { email, password }, this.httpOptions)
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                if(user.token){
                  localStorage.setItem('currentUser', JSON.stringify(user));
                  this.currentUserSubject.next(user);
                }
                //if it didn't return a token, must be resend of verification link
                return user;                
            }));
    }

    updatePass(email: string, password: string, newPassword: string) {
      if(!this.validateService.isValidEmail(email) || !this.validateService.isValidPassword(password) || !this.validateService.isValidPassword(newPassword)){
        return;
      }
      return this.http.post<any>(`api/open/users/password`, { email: email, password: password, newPassword: newPassword }, this.httpOptions)
          .pipe(map(isUpdated => {
              //return a boolean of whether the password has been updated
              return isUpdated;                
          }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    createUserAccnt(name: string, email: string, password: string){
        if(!this.validateService.isValidEmail(email) || 
          !this.validateService.isValidPassword(password) ||
          !this.validateService.isValidName(name)){
          return;
        }
        return this.http.post<any>(`api/open/users/newAccount`, {name, email, password}, this.httpOptions);
    }

    verifyNewAccnt(link: string){      
      return this.http.post<any>(`api/open/users/verification`, {link});
    }

    sendGoogleTokenToApi(token: string){
      return this.http.post<any>('api/open/users/googleAuthenticate', {token}, this.httpOptions)
        .pipe(map(user => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
      }));
    }
}