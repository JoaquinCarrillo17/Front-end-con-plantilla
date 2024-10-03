import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Huesped } from '../interfaces/huesped.interface';
import { HuespedesService } from '../services/huespedes.service';
import { AddGuestComponent } from '../add-guest/add-guest.component';
import { EditGuestComponent } from '../edit-guest/edit-guest.component';
import { DatePipe } from '@angular/common';
import { TokenService } from '../../token/token.service';
import { dateFormatter } from 'src/app/theme/shared/dateFormatter';

@Component({
  selector: 'app-guest-list',
  standalone: true,
  imports: [SharedModule, AddGuestComponent, EditGuestComponent],
  templateUrl: './guest-list.component.html',
  styleUrl: './guest-list.component.scss'
})
export class GuestListComponent implements OnInit {

  isSpinnerVisible: boolean = true;
  public huespedes: any[];
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

  public puedeCrear: boolean;

  public idHuesped: number; // ? cuando abro un modal actualizo este id para saber sobre que Huesped ejecuto la accion

  public usuario: any;
  public esSuperAdmin: boolean;

  constructor(private huespedesService: HuespedesService, private tokenService: TokenService) { }

  ngOnInit(): void {
    this.query = "";
    this.usuario = localStorage.getItem("usuario");
    this.esSuperAdmin = localStorage.getItem("superadmin") === "true";
    this.puedeCrear = this.tokenService.getRoles().includes('ROLE_HUESPEDES_W');

    this.getHuespedes(this.query);
  }

  private getDataForRequest(value: string): any {
    const listSearchCriteria: any[] = [];

    if (value) {
      listSearchCriteria.push(
        { key: 'nombreCompleto', operation: 'contains', value: value },
        { key: 'dni', operation: 'equals', value: value },
        { key: 'email', operation: 'contains', value: value },
        { key: 'habitacion.numero', operation: 'equals', value: value },
        { key: 'habitacion.hotel.nombre', operation: 'contains', value: value },
      );

      if (!isNaN(Number(value))) {
        listSearchCriteria.push({
          key: "id",
          operation: "equals",
          value: parseInt(value, 10)
        });
      }

      const date = new Date(value); // Suponiendo que `value` puede ser una fecha

      if (!isNaN(date.getTime())) { // Verifica si es una fecha válida
        const formattedDate = dateFormatter.formatDateToYyyyMmDd(date);
        console.log(formattedDate);
        listSearchCriteria.push(
          { key: 'fechaCheckIn', operation: 'equals', value: formattedDate },
          { key: 'fechaCheckOut', operation: 'equals', value: formattedDate }
        );
      }

    }

    // Si no es superadmin, filtrar por idUsuario
    if (!this.esSuperAdmin) {
      listSearchCriteria.push({
        key: 'habitacion.hotel.idUsuario',
        operation: 'equals',
        value: this.usuario
      });
    }

    return {
      listOrderCriteria: {
        valueSortOrder: this.valueSortOrder,
        sortBy: this.sortBy
      },
      listSearchCriteria: listSearchCriteria,
      page: {
        pageIndex: this.pageNumber,
        pageSize: this.itemsPerPage
      }
    };
  }

  getHuespedes(value: string): void {
    this.isSpinnerVisible = true;
    this.huespedesService.getHuespedesDynamicFilterOr(this.getDataForRequest(value))
      .subscribe(response => {
        this.huespedes = response.content;
        this.totalItems = response.totalElements;
        this.isSpinnerVisible = false;
      },
        (error) => {
          if (error.status === 404) {
            this.huespedes = [];
            this.totalItems = 0;
          }
          console.error('Error al cargar los huespedes:', error);
          this.isSpinnerVisible = false;
        });
  }

  search(value: string): void {
    this.isSpinnerVisible = true;
    this.getHuespedes(value);
    this.query = value;
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
    this.getHuespedes(this.query);
  }

  onPageChange(value: number): void {
    this.pageNumber = value;
    this.getHuespedes(this.query);
  }

  onItemPerPageChange(value: number): void {
    this.itemsPerPage = value;
    this.getHuespedes(this.query);
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
