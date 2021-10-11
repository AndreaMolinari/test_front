import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaApplicativiButtonComponent } from './lista-applicativi-button.component';

describe('ListaApplicativiButtonComponent', () => {
  let component: ListaApplicativiButtonComponent;
  let fixture: ComponentFixture<ListaApplicativiButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaApplicativiButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaApplicativiButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
