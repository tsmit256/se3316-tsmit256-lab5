import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassNamesComponent } from './class-names.component';

describe('ClassNamesComponent', () => {
  let component: ClassNamesComponent;
  let fixture: ComponentFixture<ClassNamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassNamesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
