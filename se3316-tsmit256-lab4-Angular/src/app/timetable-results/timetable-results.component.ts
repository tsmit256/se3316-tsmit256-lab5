import { Component, OnInit } from '@angular/core';
import { CourseService } from '../_services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from '../_models/course'

@Component({
  selector: 'app-timetable-results',
  templateUrl: './timetable-results.component.html',
  styleUrls: ['./timetable-results.component.css']
})
export class TimetableResultsComponent implements OnInit {
  courses: Course[];
  subjectCode;
  courseCode;
  courseComponent;
  schedName;
  keyword;

  constructor(    
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router) { }

  ngOnInit(): void {
    this.courses = [];
    this.getCourses();
    //Set all showdetails to be false initially (only show glance at beginning)
    for(let i=0; i<this.courses.length; i++){
      this.courses[i].showDetail = false;
    }
  }

  toggleShowDetail(course: Course): void{
    course.showDetail = !course.showDetail;
  }

  getCourses(): void{
    this.subjectCode = this.route.snapshot.paramMap.get('subjectCode');
    this.keyword = this.route.snapshot.paramMap.get('keyword');

    //if there is a subjectCode part of the url, then show results via getCoursesFromSearch()
    if(this.subjectCode){
      this.getCoursesFromSearch();
    }
    else if(this.keyword){ //if there is a keyword part of the url, then show results via keyword
      this.getCoursesFromKeyword();
    }
    else{//if there is no subjectCode or keyword part of the url, then show results via getCoursesFromSchedule()
      this.getCoursesFromSchedule();
    }
  }

  getCoursesFromSearch(): void{
    this.courseCode = this.route.snapshot.paramMap.get('courseCode');
    this.courseComponent = this.route.snapshot.paramMap.get('courseComponent');
    var tempObserv;

    //If there is a courseComponent part, then search server using this
    if(this.courseComponent){
      tempObserv = this.courseService.getCoursesBySubjCourseCodeAndComp(this.subjectCode, this.courseCode, this.courseComponent);
    }
    else if(this.courseCode){ //If there is a courseCode part, then search server using this
      tempObserv = this.courseService.getCoursesBySubjectAndCourseCode(this.subjectCode, this.courseCode);
    }
    else{ //If there is only a subjectCode then search server using just this
      tempObserv = this.courseService.getCoursesBySubjectCode(this.subjectCode);
    }

    tempObserv.subscribe(courses => {
      this.courses = courses;});
  }

  getCoursesFromSchedule(): void{
    this.schedName = this.route.snapshot.paramMap.get('schedName');

    //Check in url if it is a public schedule request
    //Public sched requests should access the api via 'open' instead of 'secure'
    if(/.*\/public-timetable-results$/.test(this.router.url)){
      this.courses = this.courseService.getCoursesByPublicSchedName(this.schedName);
    }
    else{ //It is a private schedule request
      this.courses = this.courseService.getCoursesBySchedName(this.schedName);
    }
  }

  getCoursesFromKeyword(): void{
    var tempObserv = this.courseService.getCoursesByKeyword(this.keyword);
    tempObserv.subscribe(courses => {
      this.courses = courses;
    });
  }
}
