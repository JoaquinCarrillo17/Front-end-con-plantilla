import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Huesped } from '../interfaces/huesped.interface';
import { HuespedesService } from '../services/huespedes.service';
import { AddGuestComponent } from '../add-guest/add-guest.component';
import { EditGuestComponent } from '../edit-guest/edit-guest.component';

@Component({
  selector: 'app-guest-list',
  standalone: true,
  imports: [SharedModule, AddGuestComponent, EditGuestComponent],
  templateUrl: './guest-list.component.html',
  styleUrl: './guest-list.component.scss'
})
export class GuestListComponent implements OnInit{

  isSpinnerVisible: boolean = true;
  public huespedes: Huesped[];
  public totalItems: number = 0;
  public query: string = '';
  public pageNumber: number = 0;
  public itemsPerPage: number = 5;

  public mostrarModalEliminar = false;
  public mostrarModalEditarCrear = false;
  accionModal: 'editar' | 'crear' = 'editar';

  public idHuesped: number; // ? cuando abro un modal actualizo este id para saber sobre que Huesped ejecuto la accion

  constructor(private huespedesService: HuespedesService) { }

  ngOnInit(): void {
    this.huespedesService.getAllHuespedes(this.pageNumber, this.itemsPerPage)
      .subscribe(response => {
        this.huespedes = response.huespedes;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      });
  }

  search(value: string): void {
    this.isSpinnerVisible = true;
    this.huespedesService.getHuespedesFilteredByQuery(value, this.pageNumber, this.itemsPerPage)
      .subscribe(response => {
        this.huespedes = response.huespedes;
        this.totalItems = response.totalItems;
        this.query = value;
        this.isSpinnerVisible =  false;
      });
  }

  onPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.huespedesService.getHuespedesFilteredByQuery(this.query, value, this.itemsPerPage)
      .subscribe(response => {
        this.huespedes = response.huespedes;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      });
  }

  onItemPerPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.huespedesService.getHuespedesFilteredByQuery(this.query, this.pageNumber, value)
      .subscribe(response => {
        this.huespedes = response.huespedes;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      });
  }

  deleteHuesped() {
    this.huespedesService.deleteHuesped(this.idHuesped).subscribe(response => {
      window.location.reload(); // ? Recargo la pagina para mostrar los cambios
    },
    error => {
      console.error(`Error al eliminar la habitación ${this.idHuesped}`, error);
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
