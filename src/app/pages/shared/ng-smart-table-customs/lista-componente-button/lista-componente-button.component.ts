import { Component, OnInit } from '@angular/core';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { ComponenteModalComponent } from '../../modals/componente-modal/componente-modal.component';
import { ModalActionService } from 'src/app/API/modals/modal-action.service';

@Component({
  selector: 'shared-lista-componente-button',
  templateUrl: './lista-componente-button.component.html',
  styleUrls: ['./lista-componente-button.component.less']
})
export class ListaComponenteButtonComponent implements OnInit {

  public value;

  constructor(
    private toastrService: NbToastrService,
    private modalActions: ModalActionService,
    private dialogService: NbDialogService
  ) { }

  ngOnInit(): void { }

  reroute(idComponente?: number): void {
    if (idComponente === undefined) {
      this.toastrService.danger('', 'Nessun componente collegato!', { preventDuplicates: true });
    } else {
      this.dialogService.open(ComponenteModalComponent, { context: { idComponente } })
        .onClose.subscribe(data => {
          if (data) {
            this.modalActions.callRefreshTable();
          }
        });
    }

  }

}
