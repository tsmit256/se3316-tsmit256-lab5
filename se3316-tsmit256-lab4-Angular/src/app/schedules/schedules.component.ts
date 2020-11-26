import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Schedule } from '../_models/schedule';
import { ScheduleService } from '../_services/schedule.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit {
  schedules: Schedule[];
  fromSavePairAction;
  subjectCode;
  courseCode;
  createSchedForm: FormGroup;
  submitted = false;
  createError = '';

  constructor(
    private scheduleService: ScheduleService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) { 
      this.schedules = [];
    }


  ngOnInit(): void {
    //set validators for the create form
    this.createSchedForm = this.formBuilder.group({
      schedName: ['', [Validators.required, Validators.maxLength(50)]],
      descr: ['', [Validators.maxLength(500)]],
      publicBool: [false, []]
    });

    this.determineUrl();
    this.getSchedules();
  }

  // convenience getter for easy access to form fields
  get f() { return this.createSchedForm.controls; }

  //If this component was initiated by saving a pair then flag that using fromSavePairAction bool
  determineUrl(){
    let pair = this.route.snapshot.paramMap.get('pair');

    if(pair){
      this.fromSavePairAction = true;
      this.subjectCode = pair.split('__')[0];
      this.courseCode = pair.split('__')[1];
    }
    else{
      this.fromSavePairAction = false;
    }    
  }

  getSchedules(): void{
    let result = this.scheduleService.getSchedules();
    
    if(result){
      result.subscribe(
        data => {
          this.schedules = data;
          //Set all showdetails to be false initially (only show glance at beginning)
          for(let i=0; i<this.schedules.length; i++){
            this.schedules[i].showDetail = false;
            this.schedules[i].deleteConfirm = false;
        }
        });
    }
  }

  toggleExpand(schedule){
    schedule.showDetail = !schedule.showDetail;
  }

  //Pairs property is an object that must be converted to array before displaying in *ngFor loop
  toArray(pairs){
    return Object.keys(pairs).map(key => pairs[key])
  }

  selectedSchedule: Schedule;
  onSelect(schedule: Schedule): void {
    this.selectedSchedule = schedule;
    schedule.deleteConfirm = false;
  }

  add(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.createSchedForm.invalid) {
        return;
    }

    let result = this.scheduleService.addSchedule({
      name: this.f.schedName.value.trim(),  
      description: this.f.descr.value,
      public: this.f.publicBool.value
    } as Schedule);
      
    if(result){ //The subscribe function will not execute if the underlying service determines it is not a valid name
      result.subscribe(
        schedule => {
        this.schedules.push(schedule);
        },
        error => { 
          alert(error);
          this.createError = error;
      });
    }
    
  }

  delete(schedule: Schedule): void {
    let result = this.scheduleService.deleteSchedule(schedule);

    if(result){
      result.subscribe();
      this.schedules = this.schedules.filter(s => s.name !== schedule.name);
      if(schedule.name == this.selectedSchedule.name){
        this.selectedSchedule = null;
      }
    }
    
  }

  savePairToSched(schedName: string): void{
    let result = this.scheduleService.savePairToSched(this.subjectCode, this.courseCode, schedName);

    if(result){
      result.subscribe(
        data => {
          for(var s in this.schedules){
            if(this.schedules[s].name == schedName)
              this.schedules[s] = data;
          };
        }
      );
      
    }
  }
}
