import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElencoErroriComponent } from './elenco-errori.component';

describe('ElencoErroriComponent', () => {
  let component: ElencoErroriComponent;
  let fixture: ComponentFixture<ElencoErroriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElencoErroriComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElencoErroriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
