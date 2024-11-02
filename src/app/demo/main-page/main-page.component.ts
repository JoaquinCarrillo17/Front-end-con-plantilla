import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UbicacionService } from '../ubicacion/ubicacion.service';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    SharedModule,
  CommonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

  ubicacionesPorContinente: { [key: string]: any[] } = {};

  cards = [
    { title: 'Bar', image: 'bar.jpg', description: 'Relájate en nuestro chill out', key: 'BAR' },
    { title: 'Mascota', image: 'mascota.jpg', description: 'Ven con tu mascota', key: 'PET FRIENDLY' },
    { title: 'Gimnasio', image: 'gym.jpg', description: 'Entrena en nuestro gimnasio', key: 'GIMNASIO' },
    { title: 'Piscina', image: 'piscina.jpg', description: 'Disfruta de nuestra piscina', key: 'PISCINA' },
    { title: 'Karaoke', image: 'karaoke.jpeg', description: 'Diviértete en el karaoke', key: 'KARAOKE' },
    { title: 'Casino', image: 'casino.jpg', description: 'Prueba suerte en el casino', key: 'CASINO' }
  ];

  constructor(
    private ubicacionService: UbicacionService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.cargarUbicaciones();
  }

  // Método para cargar las ubicaciones y agruparlas por continente
  cargarUbicaciones(): void {
    this.ubicacionService.getAllUbicaciones().subscribe((ubicaciones) => {
      this.ubicacionesPorContinente = this.agruparPorContinente(ubicaciones);
      console.log(this.ubicacionesPorContinente);
    });
  }

  // Agrupar las ubicaciones por continente
  agruparPorContinente(ubicaciones: any[]): any {
    return ubicaciones.reduce((continentes, ubicacion) => {
      const { continente, ciudad } = ubicacion;
      if (!continentes[continente]) {
        continentes[continente] = [];
      }
      continentes[continente].push(ubicacion);
      return continentes;
    }, {});
  }

  filtrarPorCiudad(ciudad: string): void {
    this.router.navigate(['/hoteles'], { queryParams: { ciudad } });
  }

  filtrarPorServicio(servicio: string): void {
    this.router.navigate(['/hoteles'], { queryParams: { servicio } });
  }

}
