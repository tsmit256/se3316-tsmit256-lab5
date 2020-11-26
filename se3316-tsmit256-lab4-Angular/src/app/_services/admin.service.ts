import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CourseReview, Log } from '../_models/courseReview';
import { Pair } from '../_models/schedule';
import { MessageService } from './message.service';
import { ValidateService } from './validate.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  grantUrl = `api/admin/grantPrivilege`;
  activateUrl = `api/admin/activation`;
  reviewsUrl = `api/admin/reviews`;
  hiddenUrl = `api/admin/reviews-hidden`;
  
  constructor(private messageService: MessageService, 
              private validateService: ValidateService,
              private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  //used to change the user's role to admin
  grantPrivilege(email: string): Observable<any>{
    if(!this.validateService.isValidEmail(email)){
      return;
    }

    return this.http.post(this.grantUrl, {email: email}, this.httpOptions).pipe(
      tap(() => this.log(`added privilege`)),
      catchError(this.handleError<any>('grantPrivilege'))
    );
  }

  //Used to change the activation/deactivation of a specified email user
  toggleActivate(email: string): Observable<any>{
    if(!this.validateService.isValidEmail(email)){
      return;
    }

    return this.http.post(this.activateUrl, {email: email}, this.httpOptions).pipe(
      tap(() => this.log(`changed activation`)),
      catchError(this.handleError<any>('toggleActivate'))
    );
  }


  /** GET all reviews from the server*/
  getReviews(): Observable<CourseReview[]> {    
    return this.http.get<CourseReview[]>(this.reviewsUrl)
      .pipe(
        tap(_ => this.log(`fetched all reviews`)),
        catchError(this.handleError<CourseReview[]>(`getReviews`, []))
      );
  }

  //Change the hidden status of the review
  toggleHidden(reviewId: number): Observable<any>{
    //if reviewId is not a number then don't proceed
    if(typeof(reviewId) !== typeof(1) && reviewId != 0){
      alert("Not a valid reviewId");
      return;
    }
    
    return this.http.post(this.hiddenUrl, {reviewId: reviewId}, this.httpOptions).pipe(
      tap(() => this.log(`changed hidden status`)),
      catchError(this.handleError<any>('toggleHidden'))
    );
  }

  //Log a request/notice/dispute
  logReq(typeReq: string, date: string, id: number): Observable<any>{   
    return this.http.post(`api/admin/logs`, {typeReq: typeReq, date: date, id: id}, this.httpOptions).pipe(
      tap(() => this.log(`added log`)),
      catchError(this.handleError<any>('logReq'))
    );
  }

  //Get all logs
  getAllLogs(): Observable<Log[]>{
    return this.http.get<Log[]>('api/admin/logs')
      .pipe(
        tap(_ => this.log(`fetched all logs`)),
        catchError(this.handleError<Log[]>(`getAllLogs`, []))
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

      alert(error.error);
    
      this.log(`${operation} failed: ${error}`);

      // Let the app keep running by returning an empty result.
      return EMPTY;
    };
  }
}
