import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TachoListaComponent } from './tacho-lista.component';

describe('TachoListaComponent', () => {
  let component: TachoListaComponent;
  let fixture: ComponentFixture<TachoListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TachoListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TachoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
