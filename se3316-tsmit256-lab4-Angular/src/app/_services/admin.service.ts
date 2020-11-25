import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { ValidateService } from './validate.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  grantUrl = `api/admin/grantPrivilege`;
  
  constructor(private messageService: MessageService, 
              private validateService: ValidateService,
              private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  grantPrivilege(email: string): Observable<any>{
    if(!this.validateService.isValidEmail(email)){
      return;
    }

    return this.http.post(this.grantUrl, {email: email}, this.httpOptions).pipe(
      tap(() => this.log(`added privilege`)),
      catchError(this.handleError<any>('grantPrivilege'))
    )
  }

  /** Log a ReviewService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ReviewService: ${message}`);
  }
  
      /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed **/
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      alert(error.error);
    
      this.log(`${operation} failed: ${error}`);

      // Let the app keep running by returning an empty result.
      return EMPTY;
    };
  }
}
