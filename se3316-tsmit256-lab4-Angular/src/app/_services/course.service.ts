import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { Course } from '../_models/course';
import { Pair } from '../_models/schedule';
import { ValidateService } from './validate.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courseUrl = 'api/open/courses';
  tempCourses: Course[];

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private validateService: ValidateService) { }


  /** GET particular courses from the server by subjectCode*/
  getCoursesBySubjectCode(subjectCode: string): Observable<Course[]> {
    if(!this.validateService.isValidCode(subjectCode)){
      return;
    }

    const url = `${this.courseUrl}/${subjectCode}`;
    var result = this.http.get<Course[]>(url)
      .pipe(
        tap(_ => this.log(`fetched courses subjectCode=${subjectCode}`)),
        catchError(this.handleError<Course[]>(`getCoursesBySubjectCode subjectCode=${subjectCode}`, []))
      );
    return result;
  }

  /** GET particular courses from the server by subjectCode and courseCode*/
  getCoursesBySubjectAndCourseCode(subjectCode: string, courseCode: string): Observable<Course[]> {
    if(!this.validateService.isValidCode(subjectCode) || !this.validateService.isValidCode(courseCode)){
      return;
    }

    const url = `${this.courseUrl}/${subjectCode}/${courseCode}`;
    return this.http.get<Course[]>(url)
      .pipe(
        tap(_ => this.log(`fetched courses subjectCode=${subjectCode}, courseCode=${courseCode}`)),
        catchError(this.handleError<Course[]>(`getCoursesBySubjectAndCourseCode subjectCode=${subjectCode}, courseCode=${courseCode}`, []))
      );
  }

  /** GET particular courses from the server by subjectCode and courseCode and component*/
  getCoursesBySubjCourseCodeAndComp(subjectCode: string, courseCode: string, courseComponent: string): Observable<Course[]> {
    if(!this.validateService.isValidCode(subjectCode) || !this.validateService.isValidCode(courseCode)
    || !this.validateService.isValidCode(courseComponent)){
      return;
    }
    
    const url = `${this.courseUrl}/${subjectCode}/${courseCode}/${courseComponent}`;
    return this.http.get<Course[]>(url)
      .pipe(
        tap(_ => this.log(`fetched courses subjectCode=${subjectCode}, courseCode=${courseCode}, courseComponent=${courseComponent}`)),
        catchError(this.handleError<Course[]>(`getCoursesBySubjCourseCodeAndComp subjectCode=${subjectCode}, courseCode=${courseCode}, courseComponent=${courseComponent}`, []))
      );
  }

  getCourseCodes(subjectCode: string){
    let courseCodes = [];
    this.tempCourses = [];
    //Get the courses
    let result = this.getCoursesBySubjectCode(subjectCode);

    if(result){
      result.subscribe(courses => {
        this.tempCourses = courses;

        //Get the course code of each course
        for (let i = 0; i < this.tempCourses.length; i++){
          courseCodes.push({catalog_nbr: this.tempCourses[i].catalog_nbr});
        }
      });
    }
  
    return courseCodes;
  }

  getCourseComponents(subjectCode: string, courseCode: string){
    let courseComponents = [];
    this.tempCourses = [];
    //Get the courses
    let result = this.getCoursesBySubjectAndCourseCode(subjectCode, courseCode);
    
    if(result){
      result.subscribe(courses => {
        this.tempCourses = courses;
    
        //Get the course code of each course
        for (let i = 0; i < this.tempCourses[0].course_info.length; i++){
          courseComponents.push({ssr_component: this.tempCourses[0].course_info[i].ssr_component});
        }
      });
    }

    return courseComponents;
  }

  getCoursesBySchedName(schedName: string, access = "secure"){
    let courses_total = [];

    //Get the pairs that are stored in the schedule
    let result = this.getPairsBySchedName(schedName, access);

    if(result){
      result.subscribe(pairs => {

        //for each pair that is returned, get the course details for that pair
        for(let i = 0; i < pairs.length; i++){
          let result_2 = this.getCoursesBySubjectAndCourseCode(pairs[i].subjectCode, pairs[i].catalog_nbr);
            
          if(result_2){
            result_2.subscribe(courses_temp => {
              //Add each course from this pair to the total amount of courses              
              for(let j = 0; j < courses_temp.length; j++){
                courses_total.push(courses_temp[j]);
              }
            });
          }
        }
      });
    }
      
    return courses_total;
  }

  //Public sched requests should access the api via 'open' instead of 'secure'
  getCoursesByPublicSchedName(schedName: string){
    return this.getCoursesBySchedName(schedName, "open");
  }

  getPairsBySchedName(schedName: string, access: string): Observable<Pair[]> {
    if (!this.validateService.isValidScheduleName(schedName)){
      return;
    }

    //Access specifies whether it is requesting a public or private schedule (public=open, private=secure)
    const url = `api/${access}/schedules/${schedName}`;
    var result = this.http.get<Pair[]>(url)
      .pipe(
        tap(_ => this.log(`fetched pairs schedName=${schedName}`)),
        catchError(this.handleError<Pair[]>(`getPairsBySchedNAme schedName=${schedName}`, []))
      );
    return result;
  }

  getCoursesByKeyword(keyword: string): Observable<Course[]>{
    if(!this.validateService.isValidKeyword(keyword)){
      return;
    }

    const url = `/api/open/keyword/courses/${keyword}`;
    return this.http.get<Course[]>(url)
      .pipe(
        tap(_ => this.log(`fetched courses keyword=${keyword}`)),
        catchError(this.handleError<Course[]>(`getCoursesByKeyword keyword=${keyword}`, []))
      );
  }


  /** Log a CourseService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`CourseService: ${message}`);
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


