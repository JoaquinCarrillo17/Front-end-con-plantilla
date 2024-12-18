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
import { ConfirmDialogComponent } from 'src/app/theme/shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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

  reservas = [];
  totalItems: number = 0;
  pageNumber: number = 0;
  itemsPerPage: number = 5;
  valueSortOrder: string = 'ASC';
  sortBy: string = 'checkIn';

  idUsuario: any;

  showNotification: boolean = false;
  message: any;
  color: boolean = false;

  constructor(
    private reservasService: ReservasService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.idUsuario = localStorage.getItem('usuario');

    this.getMisReservas();
  }

  getMisReservas() {
    const body = {
      listOrderCriteria:
        {
          valueSortOrder: this.valueSortOrder,
          sortBy: this.sortBy,
        },
      listSearchCriteria: [
        { key: 'idUsuario', operation: 'equals', value: this.idUsuario },
      ],
      page: {
        pageIndex: this.pageNumber,
        pageSize: this.itemsPerPage,
      },
    };
    this.reservasService.dynamicSearch(body).subscribe(
      (response: any) => {
        this.isSpinnerVisible = false;
        this.reservas = response.content;
        this.totalItems = response.totalElements;
      },
      (error) => {
        console.error('Error al obtener las reservas: ', error);
        this.isSpinnerVisible = false;
      },
    );
  }

  cancelarReserva(idReserva) {
    this.reservasService.delete(idReserva).subscribe(
      (response) => {
        this.showNotification = true;
        this.message = 'Operación realizada con éxito';
        this.color = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
        this.getMisReservas();
      },
      (error) => {
        this.showNotification = true;
        this.message = 'Error al realizar la operación';
        this.color = false;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      },
    );
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
    return reserva.huespedes
      .map((huesped) => huesped?.nombreCompleto || 'Sin nombre')
      .join(', ');
  }

  mostrarModalCancelar(idReserva: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Cancelar Reserva',
        message: '¿Estás seguro de que quieres cancelar tu reserva?',
        confirmText: 'Sí',
        cancelText: 'No',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.confirmarCancelarReserva(idReserva);
      }
    });
  }

  confirmarCancelarReserva(idReserva: number): void {
    this.reservasService.delete(idReserva).subscribe(
      () => {
        console.log('Reserva cancelada');
        this.getMisReservas();
      },
      (error) => {
        console.error('Error al cancelar la reserva:', error);
      },
    );
  }
}



