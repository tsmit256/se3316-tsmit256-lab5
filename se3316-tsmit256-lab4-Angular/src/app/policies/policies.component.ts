import { Component, OnInit } from '@angular/core';
import { PolicyService } from '../_services/policy.service';

@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.css']
})
export class PoliciesComponent implements OnInit {
  spPolicyDescr = "";
  dmcaPolicyDescr = "";

  constructor(private policyService: PolicyService) { }

  ngOnInit(): void {
    this.getSpPolicy();
    this.getDmcaPolicy();
  }

  getSpPolicy(){
    this.policyService.getSpPolicy().subscribe(
      data => {
        this.spPolicyDescr = data.descr;
      });
  }

  getDmcaPolicy(){
    this.policyService.getDmcaPolicy().subscribe(
      data => {
        this.dmcaPolicyDescr = data.descr;
      });
  }


}
