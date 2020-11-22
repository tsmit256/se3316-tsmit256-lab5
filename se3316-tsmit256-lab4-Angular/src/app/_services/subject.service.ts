import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { ClassName, Subject } from '../_models/subject';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private subjectsUrl = 'api/secure/subjects';
  private classNamesUrl = 'api/open/classNames';

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

    /** GET classNames from the server */
    getClassNames(): Observable<ClassName[]> {
      return this.http.get<ClassName[]>(this.classNamesUrl)
        .pipe(
          tap(_ => this.log('fetched classNames')),
          catchError(this.handleError<ClassName[]>('getClassNames', []))
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
    
      this.log(`${operation} failed: ${error.status} ${error.statusText} - ${error.error}`);

      // Let the app keep running by returning an empty result.
      return EMPTY;
    };
  }
}


