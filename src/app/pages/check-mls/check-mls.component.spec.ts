import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckMLSComponent } from './check-mls.component';

describe('CheckMLSComponent', () => {
  let component: CheckMLSComponent;
  let fixture: ComponentFixture<CheckMLSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckMLSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckMLSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
