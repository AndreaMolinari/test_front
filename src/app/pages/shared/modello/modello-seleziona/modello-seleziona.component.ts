import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'shared-modello-seleziona',
  templateUrl: './modello-seleziona.component.html',
  styleUrls: ['./modello-seleziona.component.less']
})
export class ModelloSelezionaComponent implements OnInit {

  @Output() outForm = new EventEmitter<FormArray>();

  @Input() parentForm: FormArray;

  questoForm: FormGroup;
  
  @Input() max: number = 99;

  arrayBrand = [
    {
      id: 1,
      contenuto: 'brand 1'
    },
    {
      id: 2,
      contenuto: 'brand 2'
    },
    {
      id: 3,
      contenuto: 'brand 3'
    },
  ];
  arrayTipologia = [
    {
      id: 1,
      contenuto: 'tipologia 1'
    },
    {
      id: 2,
      contenuto: 'tipologia 2'
    },
    {
      id: 3,
      contenuto: 'tipologia 3'
    },
  ];
  arrayModello = [
    {
      id: 1,
      contenuto: 'modello 1'
    },
    {
      id: 2,
      contenuto: 'modello 2'
    },
    {
      id: 3,
      contenuto: 'modello 3'
    },
  ];

  constructor(private fb: FormBuilder) {
    this.questoForm = this.fb.group({});
  }

  ngOnInit() {
    this.questoForm.setControl('parentForm', this.parentForm);
    this.add();
  }

  crea(): FormGroup {   
    return this.fb.group({
      idBrand: ['', Validators.required],
      idTipologia: ['', Validators.required],
      idModello: ['', Validators.required],
      bloccato: ['']
    });
  }

  aggBrand($event){
    if ($event == "brand"){
      console.log("ok brand");
      // this.dialogService.open(ModalComponent)
    } else if ($event == "tipologia"){
      console.log("ok tipologia");
      // this.dialogService.open(ModalComponent)
    } else if ($event == "modello"){
      // this.dialogService.open(ModalComponent)
      console.log("ok modello");
    }
  }

  add(): void {
    if(this.parentForm.length < this.max)
    {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());
      this.outForm.emit(this.parentForm);
    }else{
      alert("non puoi aggiungere più di "+this.max+" modelli")
    }
  }

  remove(i)
  {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;
    this.parentForm.removeAt(i);
    this.outForm.emit(this.parentForm);
  }

}
