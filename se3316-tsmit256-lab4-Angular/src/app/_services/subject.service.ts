import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ClassName, Subject } from '../_models/subject';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private subjectsUrl = 'api/open/subjects';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }


  /** GET subjects from the server */
  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.subjectsUrl)
      .pipe(
        tap(_ => this.log('fetched subjects')),
        catchError(this.handleError<Subject[]>('getSubjects', []))
      );
  }

  /** Log a SubjectService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`SubjectService: ${message}`);
  }


      /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed **/
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      alert(error.error);
    
      this.log(`${operation} failed: ${error.error}`);

      // Let the app keep running by returning an empty result.
      return EMPTY;
    };
  }
}


