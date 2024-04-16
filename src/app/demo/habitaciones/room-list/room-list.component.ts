import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Habitacion } from '../interfaces/habitacion.interface';
import { HabitacionesService } from '../services/habitaciones.service';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.scss'
})
export class RoomListComponent implements OnInit {

  isSpinnerVisible: boolean = true;
  public habitaciones: Habitacion[];
  public totalItems: number = 0;
  public query: string = '';
  public pageNumber: number = 0;
  public itemsPerPage: number = 5;

  constructor(private habitacionesService: HabitacionesService){ }

  ngOnInit(): void {
    this.habitacionesService.getAllHabitacionesMagicFilter(this.pageNumber, this.itemsPerPage)
      .subscribe(response => {
        this.habitaciones = response.habitaciones;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      });
  }

  search(value: string): void {
    this.isSpinnerVisible = true;
    this.habitacionesService.getHabitacionesFilteredByQuery(value, this.pageNumber, this.itemsPerPage)
      .subscribe(response => {
        this.habitaciones = response.habitaciones;
        this.totalItems = response.totalItems;
        this.query = value;
        this.isSpinnerVisible = false;
      });
  }

  onPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.habitacionesService.getHabitacionesFilteredByQuery(this.query, value, this.itemsPerPage)
      .subscribe(response => {
        this.habitaciones = response.habitaciones;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      });
  }

  onItemPerPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.habitacionesService.getHabitacionesFilteredByQuery(this.query, this.pageNumber, value)
      .subscribe(response => {
        this.habitaciones = response.habitaciones;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      });
  }


}
