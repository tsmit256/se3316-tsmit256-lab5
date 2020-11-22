import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-keyword-search',
  templateUrl: './keyword-search.component.html',
  styleUrls: ['./keyword-search.component.css']
})
export class KeywordSearchComponent implements OnInit {
  keywrdSrchForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, 
              private router: Router) { }

  ngOnInit(): void {
    this.keywrdSrchForm = this.formBuilder.group({
      keyword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(200)]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.keywrdSrchForm.controls; }

  onKeywrdSrchSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.keywrdSrchForm.invalid) {
        return;
    }

    this.router.navigate([`/timetable-results-keyword/${this.f.keyword.value}`]);
  }

}
