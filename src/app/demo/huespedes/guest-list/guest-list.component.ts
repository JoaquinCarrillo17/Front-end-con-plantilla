import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Huesped } from '../interfaces/huesped.interface';
import { HuespedesService } from '../services/huespedes.service';
import { AddGuestComponent } from '../add-guest/add-guest.component';
import { EditGuestComponent } from '../edit-guest/edit-guest.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-guest-list',
  standalone: true,
  imports: [SharedModule, AddGuestComponent, EditGuestComponent],
  templateUrl: './guest-list.component.html',
  styleUrl: './guest-list.component.scss'
})
export class GuestListComponent implements OnInit {

  isSpinnerVisible: boolean = true;
  public huespedes: Huesped[];
  public totalItems: number = 0;
  public query: string = '';
  public pageNumber: number = 0;
  public itemsPerPage: number = 5;
  public valueSortOrder: string = 'ASC';
  public sortBy: string = 'id';

  public mostrarModalEliminar = false;
  public mostrarModalEditarCrear = false;
  accionModal: 'editar' | 'crear' = 'editar';

  public showBorrarHuespedNotification = false;
  public showBorrarHuespedErrorNotification = false;

  public idHuesped: number; // ? cuando abro un modal actualizo este id para saber sobre que Huesped ejecuto la accion

  constructor(private huespedesService: HuespedesService) { }

  ngOnInit(): void {
    this.huespedesService.getAllHuespedesMagicFilter()
      .subscribe(response => {
        this.huespedes = response.huespedes;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      },
        (error) => {
          console.error('Error al cargar los huespesdes:', error);
          this.isSpinnerVisible = false; // En caso de error, también oculta el spinner
        });
  }

  search(value: string): void {
    this.isSpinnerVisible = true;
    this.huespedesService.getHuespedesFilteredByQuery(value, this.valueSortOrder, this.sortBy, this.pageNumber, this.itemsPerPage)
      .subscribe(response => {
        this.huespedes = response.huespedes;
        this.totalItems = response.totalItems;
        this.query = value;
        this.isSpinnerVisible = false;
      },
        (error) => {
          console.error('Error al cargar los huespedes:', error);
          this.isSpinnerVisible = false; // En caso de error, también oculta el spinner
        });

  }

  order(columnName: string) {
    let direction = 'ASC';
    if (this.sortBy === columnName) {
      if (this.valueSortOrder === 'ASC') {
        direction = 'DESC';
      } else direction = 'ASC';
    }
    this.sortBy = columnName;
    this.valueSortOrder = direction;
    this.huespedesService.getHuespedesFilteredByQuery(this.query, this.valueSortOrder, this.sortBy, this.pageNumber, this.itemsPerPage).subscribe(response => {
      this.huespedes = response.huespedes;
      this.totalItems = response.totalItems;
    });
  }

  onPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.huespedesService.getHuespedesFilteredByQuery(this.query, this.valueSortOrder, this.sortBy, value, this.itemsPerPage)
      .subscribe(response => {
        this.huespedes = response.huespedes;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      },
        (error) => {
          console.error('Error al cargar los huespedes:', error);
          this.isSpinnerVisible = false; // En caso de error, también oculta el spinner
        });
  }

  onItemPerPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.huespedesService.getHuespedesFilteredByQuery(this.query, this.valueSortOrder, this.sortBy, this.pageNumber, value)
      .subscribe(response => {
        this.huespedes = response.huespedes;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      },
        (error) => {
          console.error('Error al cargar los huespedes:', error);
          this.isSpinnerVisible = false; // En caso de error, también oculta el spinner
        });
  }

  deleteHuesped() {
    this.huespedesService.deleteHuesped(this.idHuesped).subscribe(response => {
      this.showBorrarHuespedNotification = true;
      setTimeout(() => {
        this.showBorrarHuespedNotification = false;
      }, 3000);
      window.location.reload(); // ? Recargo la pagina para mostrar los cambios
    },
      error => {
        this.showBorrarHuespedErrorNotification = true;
        setTimeout(() => {
          this.showBorrarHuespedErrorNotification = false;
        }, 3000);
      }
    )
    this.ocultarModalEliminarHuesped();
  }

  // ? Gestion de los modales
  mostrarModalEliminarHuesped(idHuesped: number) {
    this.idHuesped = idHuesped;
    this.mostrarModalEliminar = true;
  }

  ocultarModalEliminarHuesped() {
    this.mostrarModalEliminar = false;
  }

  mostrarModalEditarHuesped(idHuesped: number) {
    this.idHuesped = idHuesped;
    this.mostrarModalEditarCrear = true;
    this.accionModal = 'editar';
  }

  ocultarModalEditarHuesped() {
    this.mostrarModalEditarCrear = false;
  }

  onFloatingButtonClick() {
    this.mostrarModalEditarCrear = true;
    this.accionModal = 'crear'
  }



}
