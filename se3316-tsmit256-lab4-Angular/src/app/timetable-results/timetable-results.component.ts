import { Component, OnInit } from '@angular/core';
import { CourseService } from '../_services/course.service';
import { ActivatedRoute } from '@angular/router';
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

  constructor(    
    private route: ActivatedRoute,
    private courseService: CourseService) { }

  ngOnInit(): void {
    this.getCourses();
  }

  getCourses(): void{
    this.subjectCode = this.route.snapshot.paramMap.get('subjectCode');

    //if there is a subjectCode part of the url, then show results via getCoursesFromSearch()
    if(this.subjectCode){
      this.getCoursesFromSearch();
    }
    else{//if there is no subjectCode part of the url, then show results via getCoursesFromSchedule()
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
      this.courses = courses;})
  }

  getCoursesFromSchedule(): void{
    this.schedName = this.route.snapshot.paramMap.get('schedName');
    this.courses = this.courseService.getCoursesBySchedName(this.schedName);
  }
}
