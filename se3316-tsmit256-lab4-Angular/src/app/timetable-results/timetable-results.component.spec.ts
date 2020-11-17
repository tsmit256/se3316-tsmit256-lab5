import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableResultsComponent } from './timetable-results.component';

describe('TimetableResultsComponent', () => {
  let component: TimetableResultsComponent;
  let fixture: ComponentFixture<TimetableResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimetableResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetableResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
