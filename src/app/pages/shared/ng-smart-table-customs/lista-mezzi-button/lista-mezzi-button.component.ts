import { Component, OnInit } from '@angular/core';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { MezzoModalComponent } from '../../modals/mezzo-modal/mezzo-modal.component';
import { ModalActionService } from 'src/app/API/modals/modal-action.service';

@Component({
  selector: 'app-lista-mezzi-button',
  templateUrl: './lista-mezzi-button.component.html',
  styleUrls: ['./lista-mezzi-button.component.less']
})

export class ListaMezziButtonComponent implements OnInit {

  public value;

  constructor(
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private modalActions: ModalActionService) { }

  ngOnInit(): void { }

  reroute(): void {
    if (this.value === 'RADIOCOMANDO' || this.value.mezzo[0] === undefined || this.value.mezzo[0].idMezzo == null) {
      this.toastrService.danger('', 'Nessun mezzo collegato!', { preventDuplicates: true });
    } else {
      this.dialogService.open(MezzoModalComponent, { context: { idMezzo: this.value.mezzo[0].idMezzo } })
        .onClose.subscribe(data => {
          if (data !== undefined) {
            this.modalActions.callRefreshTable();
          }
        });
    }

  }

}
