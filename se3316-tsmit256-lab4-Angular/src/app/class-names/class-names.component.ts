import { Component, OnInit } from '@angular/core';
import { ClassName } from '../_models/subject';
import { SubjectService } from '../_services/subject.service';

@Component({
  selector: 'app-class-names',
  templateUrl: './class-names.component.html',
  styleUrls: ['./class-names.component.css']
})
export class ClassNamesComponent implements OnInit {
  classNames: ClassName[];

  constructor(private subjectService: SubjectService) { }

  ngOnInit(): void {
    this.getClassNames();
  }

  getClassNames(): void {
    let result = this.subjectService.getClassNames();

    if(result){
      result.subscribe(classNames => this.classNames = classNames);
    }
        
  }
}
