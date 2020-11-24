import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Schedule } from '../_models/schedule';
import { ScheduleService } from '../_services/schedule.service';

@Component({
  selector: 'app-sched-detail',
  templateUrl: './sched-detail.component.html',
  styleUrls: ['./sched-detail.component.css']
})
export class SchedDetailComponent implements OnInit {
  @Input() sched: Schedule;
  editSchedForm: FormGroup;
  submitted = false;
  editError = '';

  constructor(private formBuilder: FormBuilder, private scheduleService: ScheduleService) { }

  ngOnInit(): void {
      //set validators for the create form
      this.editSchedForm = this.formBuilder.group({
        schedName: ['', [Validators.required, Validators.maxLength(50)]],
        descr: ['', [Validators.maxLength(500)]],
        publicBool: ['', []],
        deletePair: ['', []]
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.editSchedForm.controls; }

  //Save the changes to the schedule
  editSched(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.editSchedForm.invalid) {
        return;
    }

    //if there was a request to delete a pair
    if(this.f.deletePair.value){
      let parts =  this.f.deletePair.value.split(' ');
      
      //there should only be two parts
      if(parts.length == 2){
        let tempSubjectCode = parts[0];
        let tempCatalogNbr = parts[1];

        //check that requesting deleted pair is in the schedule and remove deleted pair from schedule pairs if it is in there
        var validDeleteReq = false;
        for(let i=0; i < this.sched.pairs.length; i++){
          //if the subjectCode matches and the catalog_nbr matches
          if(this.sched.pairs[i].subjectCode == tempSubjectCode && this.sched.pairs[i].catalog_nbr == tempCatalogNbr){
            validDeleteReq = true;
            this.sched.pairs.splice(i, 1);
            break;
          }
        }
      }

      if(!validDeleteReq){
        alert("The pair that was requested to be deleted does not exist in this schedule");
        return;
      }
    }
    

    let result = this.scheduleService.editSchedule({
      name: this.f.schedName.value.trim(),  
      description: this.f.descr.value,
      public: this.f.publicBool.value,
      pairs: this.sched.pairs,
      schedId: this.sched.schedId
    } as Schedule);
      
    if(result){ //The subscribe function will not execute if the underlying service determines it is not a valid name
      result.subscribe(
        schedule => {
          alert("Edits Saved!");
        },
        error => { 
          alert(error);
          this.editError = error;
      });
    }
  }
}
