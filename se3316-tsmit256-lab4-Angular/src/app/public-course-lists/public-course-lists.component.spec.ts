import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicCourseListsComponent } from './public-course-lists.component';

describe('PublicCourseListsComponent', () => {
  let component: PublicCourseListsComponent;
  let fixture: ComponentFixture<PublicCourseListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicCourseListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicCourseListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
