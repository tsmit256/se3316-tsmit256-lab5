import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CourseReview } from '../_models/courseReview';
import { Pair } from '../_models/schedule';
import { ReviewService } from '../_services/review.service';

@Component({
  selector: 'app-course-review',
  templateUrl: './course-review.component.html',
  styleUrls: ['./course-review.component.css']
})
export class CourseReviewComponent implements OnInit {
  reviews: CourseReview[];
  courseCode = "";
  subjectCode = "";
  createReviewForm: FormGroup;

  constructor(private reviewService: ReviewService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    //set validators for the create form
    this.createReviewForm = this.formBuilder.group({
      message: ['', [Validators.required, Validators.maxLength(500)]]
    });

    this.reviews = [];
    this.getReviews();
  }

  // convenience getter for easy access to form fields
  get f() { return this.createReviewForm.controls; }

  getReviews(){
    this.courseCode = this.route.snapshot.paramMap.get('courseCode');
    this.subjectCode = this.route.snapshot.paramMap.get('subjectCode');

    let result = this.reviewService.getReviews({subjectCode: this.subjectCode, catalog_nbr: this.courseCode} as Pair);

    if(result){
      result.subscribe(
        data => {
        this.reviews = data;
        });
    }
  }

  addReview(){
    //get the message from input
    let message = this.f.message.value;

    this.courseCode = this.route.snapshot.paramMap.get('courseCode');
    this.subjectCode = this.route.snapshot.paramMap.get('subjectCode');

    let result = this.reviewService.addReview({subjectCode: this.subjectCode, catalog_nbr: this.courseCode} as Pair, message);

    if(result){
      result.subscribe(
        data => {alert("Review Added!")
      },
      error => {
        alert(error);
      });
    }
  }

}
