import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedDetailComponent } from './sched-detail.component';

describe('SchedDetailComponent', () => {
  let component: SchedDetailComponent;
  let fixture: ComponentFixture<SchedDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
