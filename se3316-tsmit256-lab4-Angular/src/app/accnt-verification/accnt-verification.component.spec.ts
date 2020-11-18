import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccntVerificationComponent } from './accnt-verification.component';

describe('AccntVerificationComponent', () => {
  let component: AccntVerificationComponent;
  let fixture: ComponentFixture<AccntVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccntVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccntVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
