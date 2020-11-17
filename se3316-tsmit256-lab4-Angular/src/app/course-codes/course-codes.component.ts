import { Component, OnInit } from '@angular/core';
import { CourseService } from '../_services/course.service';
import { CourseCode } from '../_models/subject';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-course-codes',
  templateUrl: './course-codes.component.html',
  styleUrls: ['./course-codes.component.css']
})
export class CourseCodesComponent implements OnInit {
  courseCodes: CourseCode[];
  subjectCode;
  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService) { }

  ngOnInit(): void {
    this.getCourseCodes();
  }

  async getCourseCodes(): Promise<void> {
    this.subjectCode = this.route.snapshot.paramMap.get('subjectCode');
    this.courseCodes = this.courseService.getCourseCodes(this.subjectCode);
  }

  selectedCourseCode: CourseCode;
  onSelect(courseCode: CourseCode): void {
    this.selectedCourseCode = courseCode;
  }

}
