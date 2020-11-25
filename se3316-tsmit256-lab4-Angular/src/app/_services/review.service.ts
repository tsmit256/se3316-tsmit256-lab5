import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CourseReview } from '../_models/courseReview';
import { Pair } from '../_models/schedule';
import { MessageService } from './message.service';
import { ValidateService } from './validate.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private validateService: ValidateService) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /** GET reviews for a particular pair (subjectCode + catalog_nbr) from the server*/
  getReviews(pair: Pair): Observable<CourseReview[]> {
    if(!this.validateService.isValidCode(pair.subjectCode) ||
       !this.validateService.isValidCode(pair.catalog_nbr)){
         return;
    }

    let reviewsUrl = `api/secure/reviews/${pair.subjectCode}/${pair.catalog_nbr}`;
    
    return this.http.get<CourseReview[]>(reviewsUrl)
      .pipe(
        tap(_ => this.log(`fetched reviews`)),
        catchError(this.handleError<CourseReview[]>(`getReviews`, []))
      );
  }

  //Add a review to the database relating to a particular pair
  addReview(pair: Pair, message: string): Observable<CourseReview> {
    if (!this.validateService.isValidReviewDescription(message) ||
        !this.validateService.isValidCode(pair.subjectCode) ||
        !this.validateService.isValidCode(pair.catalog_nbr)){
      return;
    }

    let reviewsUrl = `api/secure/reviews/${pair.subjectCode}/${pair.catalog_nbr}`;

    return this.http.post<CourseReview>(reviewsUrl, {message: message}, this.httpOptions).pipe(
      tap((newReview: CourseReview) => this.log(`added review`)),
      catchError(this.handleError<CourseReview>('addReview'))
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
