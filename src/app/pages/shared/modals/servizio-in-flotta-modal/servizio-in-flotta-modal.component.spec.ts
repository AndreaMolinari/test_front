import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServizioInFlottaModalComponent } from './servizio-in-flotta-modal.component';

describe('ServizioInFlottaModalComponent', () => {
  let component: ServizioInFlottaModalComponent;
  let fixture: ComponentFixture<ServizioInFlottaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServizioInFlottaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServizioInFlottaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
