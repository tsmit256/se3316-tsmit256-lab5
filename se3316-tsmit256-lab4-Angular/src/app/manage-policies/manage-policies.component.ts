import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PolicyService } from '../_services/policy.service';

@Component({
  selector: 'app-manage-policies',
  templateUrl: './manage-policies.component.html',
  styleUrls: ['./manage-policies.component.css']
})
export class ManagePoliciesComponent implements OnInit {
  spForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
              private policyService: PolicyService) { }

  ngOnInit(): void {
    this.spForm = this.formBuilder.group({
      message: ['', []]
    });

    this.policyService.getSpPolicy().subscribe(
      data => {
        this.spf.message.setValue(data.descr);
      });       
  }

  // convenience getter for easy access to form fields
  get spf() { return this.spForm.controls; }

  updateSpPolicy(){
    var message = this.spf.message.value;

    var result = this.policyService.updateSpPolicy(message);

    if(result){
      result.subscribe(
        data => {
          alert("Updated!");
        },
        error => {
          alert(error);
        });
    }
  }

}
