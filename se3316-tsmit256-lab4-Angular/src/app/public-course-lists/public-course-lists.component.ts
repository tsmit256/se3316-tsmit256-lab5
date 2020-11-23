import { Component, OnInit } from '@angular/core';
import { PublicSchedule } from '../_models/schedule';
import { ScheduleService } from '../_services/schedule.service';

@Component({
  selector: 'app-public-course-lists',
  templateUrl: './public-course-lists.component.html',
  styleUrls: ['./public-course-lists.component.css']
})
export class PublicCourseListsComponent implements OnInit {
  publicSchedules: PublicSchedule[];

  constructor(private scheduleService: ScheduleService) { }

  ngOnInit(): void {
    this.publicSchedules = [];
    this.getPublicSchedules();
  }

  getPublicSchedules(){
    let result = this.scheduleService.getPublicSchedules();
    
    if(result){
      result.subscribe(data => {
        this.publicSchedules = data;

        //Set all showdetails to be false initially (only show glance at beginning)
        for(let i=0; i<this.publicSchedules.length; i++){
          this.publicSchedules[i].showDetail = false;
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


}
