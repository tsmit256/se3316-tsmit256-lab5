import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { ValidateService } from './validate.service';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  spPolicyUrl = 'api/open/policies/sp';
  spPolicyUpdateUrl = 'api/admin/policies/sp'

  constructor(private messageService: MessageService,
              private validateService: ValidateService,
              private http: HttpClient) { }

  httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getSpPolicy(): Observable<any>{
    return this.http.get(this.spPolicyUrl)
    .pipe(
      tap(_ => this.log(`fetched sp policy`)),
      catchError(this.handleError<any>(`getSpPolicy`, []))
    );
  }

  updateSpPolicy(message: string): Observable<any>{
    if(!this.validateService.isValidPolicy(message)){
      return;
    }

    return this.http.post(this.spPolicyUpdateUrl, {descr: message}, this.httpOptions).pipe(
      tap(() => this.log(`updated sp policy`)),
      catchError(this.handleError('updateSpPolicy'))
    );
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

      alert(error);
    
      this.log(`${operation} failed: ${error}`);

      // Let the app keep running by returning an empty result.
      return EMPTY;
    };
  }
}
