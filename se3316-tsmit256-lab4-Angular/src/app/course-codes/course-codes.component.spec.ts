import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCodesComponent } from './course-codes.component';

describe('CourseCodesComponent', () => {
  let component: CourseCodesComponent;
  let fixture: ComponentFixture<CourseCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseCodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
