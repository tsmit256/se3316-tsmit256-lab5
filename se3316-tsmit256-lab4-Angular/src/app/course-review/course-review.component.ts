import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Pair } from '../_models/schedule';
import { ReviewService } from '../_services/review.service';

@Component({
  selector: 'app-course-review',
  templateUrl: './course-review.component.html',
  styleUrls: ['./course-review.component.css']
})
export class CourseReviewComponent implements OnInit {
  courseCode = "";
  subjectCode = "";
  createReviewForm: FormGroup;
  submitted = false;

  constructor(private reviewService: ReviewService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    //set validators for the create form
    this.createReviewForm = this.formBuilder.group({
      message: ['', [Validators.required, Validators.maxLength(500)]]
    });

    this.courseCode = this.route.snapshot.paramMap.get('courseCode');
    this.subjectCode = this.route.snapshot.paramMap.get('subjectCode');

  }

  // convenience getter for easy access to form fields
  get f() { return this.createReviewForm.controls; }

  addReview(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.createReviewForm.invalid) {
      return;
    }

    //get the message from input
    let message = this.f.message.value;

    let result = this.reviewService.addReview({subjectCode: this.subjectCode, catalog_nbr: this.courseCode} as Pair, message);

    if(result){
      result.subscribe(
        data => {alert("Review Added!");
      },
      error => {
        alert(error);
      });
    }
  }

}
