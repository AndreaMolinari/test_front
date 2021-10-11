import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TachoAggiungiComponent } from './tacho-aggiungi.component';

describe('TachoAggiungiComponent', () => {
  let component: TachoAggiungiComponent;
  let fixture: ComponentFixture<TachoAggiungiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TachoAggiungiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TachoAggiungiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
