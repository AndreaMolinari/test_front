import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TachoCreaComponent } from './tacho-crea.component';

describe('TachoCreaComponent', () => {
  let component: TachoCreaComponent;
  let fixture: ComponentFixture<TachoCreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TachoCreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TachoCreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
