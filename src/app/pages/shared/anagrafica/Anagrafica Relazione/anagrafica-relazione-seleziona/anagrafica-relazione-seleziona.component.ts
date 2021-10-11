import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'shared-anagrafica-relazione-seleziona',
  templateUrl: './anagrafica-relazione-seleziona.component.html',
  styleUrls: ['./anagrafica-relazione-seleziona.component.less']
})
export class AnagraficaRelazioneSelezionaComponent implements OnInit {

  @Input() qtaChildren;
  @Input() listElement;

  constructor() { }

  ngOnInit() { }

  navigateToList() {
    window.scrollTo(0, document.body.scrollHeight);
  }

}
