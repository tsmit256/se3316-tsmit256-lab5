import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseComponentsComponent } from './course-components.component';

describe('CourseComponentsComponent', () => {
  let component: CourseComponentsComponent;
  let fixture: ComponentFixture<CourseComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
