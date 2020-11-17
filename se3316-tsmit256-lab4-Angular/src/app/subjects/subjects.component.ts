import { Component, OnInit } from '@angular/core';
import { SubjectService } from '../_services/subject.service';
import { Subject } from '../_models/subject';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit {
  subjects: Subject[];

  selectedSubject: Subject;
  onSelect(subject: Subject): void {
    this.selectedSubject = subject;
  }

  constructor(private subjectService: SubjectService) { }

  ngOnInit(): void {
    this.getSubjects();
  }

  getSubjects(): void {
    let result = this.subjectService.getSubjects();

    if(result){
      result.subscribe(subjects => this.subjects = subjects);
    }
        
  }
}
