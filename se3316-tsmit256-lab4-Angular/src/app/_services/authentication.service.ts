import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

    login(email: string, password: string) {
        if(!this.validateService.isValidEmail(email) || !this.validateService.isValidPassword(password)){
          return;
        }
        return this.http.post<any>(`api/open/users/authenticate`, { email, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
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
        return this.http.post<any>(`api/open/users/newAccount`, {name, email, password});
    }

    verifyNewAccnt(link: string){      
      return this.http.post<any>(`api/open/users/verification`, {link});
    }

    sendGoogleTokenToApi(token: string){
      return this.http.post<any>('api/open/users/googleAuthenticate', {token})
        .pipe(map(user => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
      }));
    }
}