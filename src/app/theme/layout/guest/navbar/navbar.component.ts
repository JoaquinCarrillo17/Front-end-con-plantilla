import { CommonModule } from "@angular/common";
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UbicacionService } from "src/app/demo/ubicacion/ubicacion.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {

  ubicacionesPorContinente: { [key: string]: any[] } = {};

  constructor(
    private router: Router,
    private ubicacionService: UbicacionService
  ) { }

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

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

}
