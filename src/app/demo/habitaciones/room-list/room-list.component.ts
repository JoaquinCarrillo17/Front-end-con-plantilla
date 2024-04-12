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

  public habitaciones: Habitacion[];

  constructor(private HabitacionesService: HabitacionesService){ }

  ngOnInit(): void {
    this.HabitacionesService.getAllHabitaciones().subscribe(habitaciones => this.habitaciones = habitaciones);
  }



}
