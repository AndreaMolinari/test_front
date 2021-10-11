import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiocomandoSelezionaComponent } from './radiocomando-seleziona.component';

describe('RadiocomandoSelezionaComponent', () => {
  let component: RadiocomandoSelezionaComponent;
  let fixture: ComponentFixture<RadiocomandoSelezionaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiocomandoSelezionaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiocomandoSelezionaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
