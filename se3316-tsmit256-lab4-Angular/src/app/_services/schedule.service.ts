import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { PublicSchedule, Schedule } from '../_models/schedule';
import { ValidateService} from './validate.service'

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  schedulesUrl = 'api/secure/schedules';
  publicSchedsUrl = 'api/open/schedules';
  tempSchedules: Schedule[];

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private validateService: ValidateService) { }

  /** GET schedules from the server*/
  getSchedules(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(this.schedulesUrl)
      .pipe(
        tap(_ => this.log(`fetched schedules`)),
        catchError(this.handleError<Schedule[]>(`getSchedules`, []))
      );
  }

  addSchedule(schedule: Schedule): Observable<Schedule> {
    if (!this.validateService.isValidScheduleName(schedule.name) ||
        !this.validateService.isValidSchedDescription(schedule.description) ||
        !this.validateService.isValidBoolean(schedule.public)){
      return;
    }
    return this.http.post<Schedule>(this.schedulesUrl, schedule, this.httpOptions).pipe(
      tap((newSchedule: Schedule) => this.log(`added schedule w/ name=${newSchedule.name}`)),
      catchError(this.handleError<Schedule>('addSchedule'))
    );
  } 

  /** DELETE: delete the schedule from the server */
  deleteSchedule(schedule: Schedule): Observable<Schedule> {
    const schedName = schedule.name;
    const url = `${this.schedulesUrl}/${schedule.name}`;

    if (!this.validateService.isValidScheduleName(schedName)){
      return;
    }

    return this.http.delete<Schedule>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted schedule name=${schedName}`)),
      catchError(this.handleError<Schedule>('deleteSchedule'))
    );
  }

  /** DELETE: delete all schedules from the server */
  deleteAllSchedules(): Observable<Schedule[]> {  
    return this.http.delete<Schedule[]>(this.schedulesUrl, this.httpOptions).pipe(
      tap(_ => this.log(`deleted all schedules`)),
      catchError(this.handleError<Schedule[]>('deleteAllSchedules'))
    );
  }

  savePairToSched(subjectCode: string, courseCode: string, schedName: string): Observable<Schedule> {
    if (!this.validateService.isValidCode(subjectCode) || !this.validateService.isValidCode(courseCode)){
      return;
    }

    if (!this.validateService.isValidScheduleName(schedName)){
      return;
    }    

    const url = `${this.schedulesUrl}/${schedName}`;
    return this.http.post<Schedule>(url, {subjectCode: subjectCode, catalog_nbr: courseCode}, 
      this.httpOptions).pipe(
      tap((schedule: Schedule) => this.log(`saved pair to schedule w/ name=${schedule.name}`)),
      catchError(this.handleError<Schedule>('savePairToSched'))
    );
  }

  getPublicSchedules(): Observable<PublicSchedule[]> {
    return this.http.get<PublicSchedule[]>(this.publicSchedsUrl)
      .pipe(
        tap(_ => this.log(`fetched public schedules`)),
        catchError(this.handleError<PublicSchedule[]>(`getPublicSchedules`, []))
      );
  }

  editSchedule(schedule: Schedule): Observable<Schedule> {
    if (!this.validateService.isValidScheduleName(schedule.name) ||
        !this.validateService.isValidSchedDescription(schedule.description) ||
        !this.validateService.isValidBoolean(schedule.public)){
      return;
    }
  
    return this.http.put<Schedule>(this.schedulesUrl, schedule, this.httpOptions).pipe(
      tap((schedule: Schedule) => this.log(`changed schedule w/ name=${schedule.name}`)),
      catchError(this.handleError<Schedule>('editSchedule'))
    );
  }



  /** Log a ScheduleService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ScheduleService: ${message}`);
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
