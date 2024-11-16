import { Component, OnInit } from '@angular/core';
import { ReservasService } from '../reservas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    CommonModule,
    FormsModule,
    SharedModule,
  ],
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.scss',
})
export class MisReservasComponent implements OnInit {

  isSpinnerVisible: boolean = true;

  reservas = []
  totalItems: number = 0;
  pageNumber: number = 0;
  itemsPerPage: number = 5;
  valueSortOrder: string = 'ASC';
  sortBy: string = 'id';

  idUsuario: any;

  isCancelModalVisible = false;
  selectedReservaId: any;


  constructor(private reservasService: ReservasService) {}

  ngOnInit(): void {

    this.idUsuario = localStorage.getItem("usuario");

    this.getMisReservas()

  }

  getMisReservas() {
    const body = {
      listOrderCriteria: [
        {
        "valueSortOrder": this.valueSortOrder,
        "sortBy": this.sortBy
      }
    ],
      listSearchCriteria: [
        { "key": 'idUsuario', "operation": 'EQUAL', "value": this.idUsuario },
      ],
      page: {
        "pageIndex": this.pageNumber,
        "pageSize": this.itemsPerPage
      }
    }
    this.reservasService.dynamicSearch(body)
     .subscribe((response: any) => {
        this.isSpinnerVisible = false;
        this.reservas = response.content;
        this.totalItems = response.totalElements;
      },
        (error) => {
          console.error('Error al obtener las reservas: ', error);
          this.isSpinnerVisible = false;
        });
  }

  cancelarReserva(idReserva) {
    this.reservasService.delete(idReserva).subscribe()
  }

  onPageChange(value: number) {
    this.isSpinnerVisible = true;
    this.pageNumber = value;
    this.getMisReservas();
  }

  onItemPerPageChange(value: number) {
    this.isSpinnerVisible = true;
    this.itemsPerPage = value;
    this.getMisReservas();
  }

  getNombresHuespedes(reserva: any): string {
    if (!reserva || !reserva.huespedes) {
      return '';
    }
    return reserva.huespedes.map(huesped => huesped?.nombreCompleto || 'Sin nombre').join(', ');
  }

  mostrarModalCancelar(reservaId: number): void {
    this.isCancelModalVisible = true;
    this.selectedReservaId = reservaId; // Almacena el ID de la reserva que se quiere cancelar
  }

  confirmarCancelarReserva(): void {
    if (this.selectedReservaId !== null) {
      this.reservasService.delete(this.selectedReservaId).subscribe(
        () => {
          console.log('Reserva cancelada');
          this.getMisReservas(); // Refresca la lista de reservas
          this.cerrarModalCancelar();
        },
        error => {
          console.error('Error al cancelar la reserva:', error);
        }
      );
    }
  }

  cerrarModalCancelar(): void {
    this.isCancelModalVisible = false;
    this.selectedReservaId = null;
  }


}
