import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiocomandoModalComponent } from './radiocomando-modal.component';

describe('RadiocomandoModalComponent', () => {
  let component: RadiocomandoModalComponent;
  let fixture: ComponentFixture<RadiocomandoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadiocomandoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiocomandoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
