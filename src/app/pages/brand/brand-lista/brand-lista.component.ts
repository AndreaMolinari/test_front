import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { BrandService } from 'src/app/API/brand/brand.service';
import { BrandPipe } from 'src/app/API/PIPES/brand/brand.pipe';
import * as globals from 'src/environments/globals';
import { NbDialogService, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-brand-lista',
  templateUrl: './brand-lista.component.html',
  styleUrls: ['./brand-lista.component.less']
})
export class BrandListaComponent implements OnInit {
  @ViewChild('delete_dialog') private dialog: TemplateRef<any>;

  source: LocalDataSource = new LocalDataSource();

  loadingData = true;

  settings = {
    actions: {
      columnTitle: 'Azioni',
      position: 'right',
      delete: false,
    },
    mode: 'external',
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
    },
    edit: {
      mode: "inline",
      editButtonContent: '<i class="nb-edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
    },
    columns: {
      id: {
        title: 'ID',
        compareFunction: (dir, a, b) => parseInt(a) >= parseInt(b) ? dir * 1 : dir * -1,
      },
      marca: {
        title: 'Marca',
        type: 'string'
      },
      fornitore: {
        title: 'Fornitore',
        type: 'string'
      },
      bloccato: {
        title: 'Bloccato',
        type: 'boolean'
      },
    },
  };

  constructor(
    private apiBrand: BrandService,
    private router: Router,
    private brandPIPE: BrandPipe,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit(): void {
    if (globals.userRole === 1) {
      this.settings.actions.delete = true;
    }
    this.apiBrand.getAll().subscribe(
      resp => {
        this.source.load(this.brandPIPE.transform(resp));
        this.loadingData = false;
      }
    )
  }

  onCreate(): void {
    this.router.navigate(['/pages/brand/aggiungi']);
  }

  onEdit($event): void {
    this.router.navigate(['/pages/brand/modifica/' + $event.data.id]);
  }

  onDelete($event): void {
    this.dialogService.open(this.dialog, { context: $event }).onClose.subscribe(data => {
      if (data) {
        this.apiBrand.deleteBrand($event.data.id).subscribe(() => {
          this.toastrService.success('Riga eliminata con successo', 'Operazione Completata');
          this.source.remove($event.data);
        }, error => {
          this.toastrService.danger(error, 'Operazione NON Completata');
          console.log(error);
        });
      } else {
        this.toastrService.info('', 'Operazione Annullata');
      }
    });
  }

}
