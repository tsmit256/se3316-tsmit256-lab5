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
  dmcaForm: FormGroup;
  aupForm: FormGroup;
  
  constructor(private formBuilder: FormBuilder,
              private policyService: PolicyService) { }

  ngOnInit(): void {
    this.spForm = this.formBuilder.group({
      message: ['', []]
    });
    this.aupForm = this.formBuilder.group({
      message: ['', []]
    });
    this.dmcaForm = this.formBuilder.group({
      message: ['', []]
    });

    //Set the initial security and privacy policy to be what is currently recorded in database
    this.policyService.getSpPolicy().subscribe(
      data => {
        this.spf.message.setValue(data.descr);
      });  

    //Set the initial acceptable use policy to be what is currently recorded in database
    this.policyService.getAupPolicy().subscribe(
      data => {
        this.aupf.message.setValue(data.descr);
      });  

    //Set the initial DMCA policy to be what is currently recorded in database
    this.policyService.getDmcaPolicy().subscribe(
      data => {
        this.dmcaf.message.setValue(data.descr);
      });    
  }

  // convenience getter for easy access to form fields
  get spf() { return this.spForm.controls; }
  get dmcaf() { return this.dmcaForm.controls; }
  get aupf() {return this.aupForm.controls; }

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

  updateAupPolicy(){
    var message = this.aupf.message.value;

    var result = this.policyService.updateAupPolicy(message);

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

  updateDmcaPolicy(){
    var message = this.dmcaf.message.value;

    var result = this.policyService.updateDmcaPolicy(message);

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
