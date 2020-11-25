import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseReview } from '../_models/courseReview';
import { AdminService } from '../_services/admin.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  reviews: CourseReview[];
  grantForm: FormGroup;
  submitted = false;
  activateForm: FormGroup;
  aSubmitted = false;

  constructor(private adminService: AdminService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getReviews();

    this.grantForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.activateForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.grantForm.controls; }
  get af() { return this.activateForm.controls; }

  grantPrivilege(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.grantForm.invalid) {
      return;
    }

    //get the email from input
    let email = this.f.email.value;

    let result = this.adminService.grantPrivilege(email);

    if(result){
      result.subscribe(
        data => {alert("Privilege Grant!");
      },
      error => {
        alert(error);
      });
    }
  }

  toggleActivate(){
    this.aSubmitted = true;

    // stop here if form is invalid
    if (this.activateForm.invalid) {
      return;
    }

    //get the email from input
    let email = this.af.email.value;

    let result = this.adminService.toggleActivate(email);

    if(result){
      result.subscribe(
        data => {
          //display deactivated notification if now deactivated
          if(data.deactivated)
            alert("User deactivated!");
          else
            alert("User activated");
      },
      error => {
        alert(error);
      });
    }
  }


  getReviews(){
    let result = this.adminService.getReviews();

    if(result){
      result.subscribe(
        data => {
          //Set the data to be the public reviews variable
          this.reviews = data;
        },
        error => {
          alert(error);
        });
    }
  }

  toggleHidden(reviewId: number){
    let result = this.adminService.toggleHidden(reviewId);

    if(result){
      result.subscribe(
        data => {
          //Update the hidden flag of the review on the screen
          for(var r in this.reviews){
            if(this.reviews[r].id == reviewId)
              this.reviews[r].hidden = data.hidden;
          }
        },
        error => {
          alert(error);
        });
    }
  }

}
