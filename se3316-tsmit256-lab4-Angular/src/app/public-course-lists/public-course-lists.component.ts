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
        console.log(this.publicSchedules);
      });
    }
  }



}
