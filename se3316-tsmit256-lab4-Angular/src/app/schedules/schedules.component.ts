import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Schedule, ScheduleCount } from '../_models/schedule';
import { ScheduleService } from '../_services/schedule.service';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit {
  scheduleNamesAndCounts: ScheduleCount[];
  fromSavePairAction;
  subjectCode;
  courseCode;

  constructor(
    private scheduleService: ScheduleService,
    private route: ActivatedRoute) { 
      this.scheduleNamesAndCounts = [];
    }


  ngOnInit(): void {
    this.determineUrl();
    this.getScheduleNamesAndCounts();
  }

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

  getScheduleNamesAndCounts(): void{
    let result = this.scheduleService.getScheduleCounts();
    
    if(result){
      result.subscribe(data => this.scheduleNamesAndCounts = data);
    }
  }

  selectedSchedule: ScheduleCount;
  onSelect(schedule: ScheduleCount): void {
    this.selectedSchedule = schedule;
  }

  add(name: string): void {
    name = name.trim();

    let result = this.scheduleService.addSchedule({ name } as Schedule);
      
    if(result){ //The subscribe function will not execute if the underlying service determines it is not a valid name
      result.subscribe(schedule => {
        this.scheduleNamesAndCounts.push({name: schedule.name, courseCount: schedule.pairs.length});
      });
    }
    
  }

  delete(schedule: Schedule): void {
    let result = this.scheduleService.deleteSchedule(schedule);

    if(result){
      result.subscribe();
      this.scheduleNamesAndCounts = this.scheduleNamesAndCounts.filter(s => s.name !== schedule.name);
    }
    
  }

  deleteAllSchedules(): void{
    let result = this.scheduleService.deleteAllSchedules();

    if(result){
      result.subscribe();
      this.scheduleNamesAndCounts = [];
    }
    
  }

  savePairToSched(schedName: string): void{
    let result = this.scheduleService.savePairToSched(this.subjectCode, this.courseCode, schedName);

    if(result){
      result.subscribe();
      alert("pair saved!");
    }
  }
}
