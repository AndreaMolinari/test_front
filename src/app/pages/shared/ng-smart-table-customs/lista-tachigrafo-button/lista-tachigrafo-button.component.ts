import { Component, OnInit } from '@angular/core';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { ComponenteModalComponent } from '../../modals/componente-modal/componente-modal.component';
import { ModalActionService } from 'src/app/API/modals/modal-action.service';

@Component({
  selector: 'shared-lista-tachigrafo-button',
  templateUrl: './lista-tachigrafo-button.component.html',
  styleUrls: ['./lista-tachigrafo-button.component.less']
})
export class ListaTachigrafoButtonComponent implements OnInit {

  public value;

  constructor(
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private modalActions: ModalActionService
  ) { }

  ngOnInit(): void { }

  reroute(idTacho?: number): void {
    if (idTacho === undefined) {
      this.toastrService.danger('', 'Nessun tachigrafo collegato!', { preventDuplicates: true });
    } else {
      this.dialogService.open(ComponenteModalComponent, { context: { idComponente: idTacho } })
        .onClose.subscribe(data => {
          if (data !== undefined) {
            this.modalActions.callRefreshTable();
          }
        });
    }

  }

}
