import { Component, OnInit } from '@angular/core';
import { CourseService } from '../_services/course.service';
import { ActivatedRoute } from '@angular/router';
import { CourseComponent } from '../_models/subject';

@Component({
  selector: 'app-course-components',
  templateUrl: './course-components.component.html',
  styleUrls: ['./course-components.component.css']
})

export class CourseComponentsComponent implements OnInit {
  courseCode;
  subjectCode;
  courseComponents: CourseComponent[];
  
  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService) { }

  ngOnInit(): void {
    this.getCourseComponents();
  }

  getCourseComponents(): void{
    let pair = this.route.snapshot.paramMap.get('pair');
    this.subjectCode = pair.split('__')[0];
    this.courseCode = pair.split('__')[1];
    this.courseComponents = this.courseService.getCourseComponents(this.subjectCode, this.courseCode);
  }
}
