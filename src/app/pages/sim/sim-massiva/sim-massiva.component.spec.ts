import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimMassivaComponent } from './sim-massiva.component';

describe('SimMassivaComponent', () => {
  let component: SimMassivaComponent;
  let fixture: ComponentFixture<SimMassivaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimMassivaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimMassivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
