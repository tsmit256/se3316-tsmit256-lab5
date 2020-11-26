import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  rfSubmitted = false;
  nfSubmitted = false;
  dfSubmitted = false;
  logReqForm: FormGroup;
  logNotForm: FormGroup;
  logDisForm: FormGroup;

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

    this.logReqForm = this.formBuilder.group({
      date: ['', [Validators.required, Validators.maxLength(100)]]
    });

    this.logNotForm = this.formBuilder.group({
      date: ['', [Validators.required, Validators.maxLength(100)]]
    });

    this.logDisForm = this.formBuilder.group({
      date: ['', [Validators.required, Validators.maxLength(100)]]
    });

    this.getAllLogs();
  }

  // convenience getter for easy access to form fields
  get f() { return this.grantForm.controls; }
  get af() { return this.activateForm.controls; }
  get rf() { return this.logReqForm.controls; }
  get nf() { return this.logNotForm.controls; }
  get df() { return this.logDisForm.controls; }

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

  getAllLogs(){
    this.adminService.getAllLogs().subscribe(
      logs => {
        //Add the logs to the respective review
        for(var r in this.reviews){
          this.reviews[r].logs = [];
          //check if any of the logs are for this review
          for(var l in logs){
            if(this.reviews[r].id == logs[l].reviewId){
              this.reviews[r].logs.push(logs[l]);
            }
          }
        }
      },
      error => {
        alert(error);
      }
    )
  }

  logReq(typeReq: string, id: number){
    let date;
    if(typeReq == "request"){
      this.rfSubmitted = true;

      // stop here if form is invalid
      if (this.logReqForm.invalid) {
        return;
      }  
      //get the date from input
      date = this.rf.date.value;
    }
    else if(typeReq == "notice"){
      this.nfSubmitted = true;

      // stop here if form is invalid
      if (this.logNotForm.invalid) {
        return;
      }
      //get the date from input
      date = this.nf.date.value;
    }
    else{
      this.dfSubmitted = true;

      // stop here if form is invalid
      if (this.logDisForm.invalid) {
        return;
      }
      //get the date from input
      date = this.df.date.value;
    }
    
    let result = this.adminService.logReq(typeReq, date, id);

    if(result){
      result.subscribe(
        data => {
          //add the new log to the review
          this.reviews.filter(obj => {return obj.id == data.reviewId})[0].logs.push(data);
      },
      error => {
        alert(error);
      });
    }
  }

}
