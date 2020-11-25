import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../_services/admin.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  grantForm: FormGroup;
  submitted = false;
  constructor(private adminService: AdminService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.grantForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.grantForm.controls; }

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

}
