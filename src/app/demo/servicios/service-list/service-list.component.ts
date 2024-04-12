import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ServiciosService } from '../services/servicios.service';
import { Servicio } from '../interfaces/servicio.interface';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.scss'
})
export class ServiceListComponent implements OnInit {

  public servicios: Servicio[];

  constructor(private ServiciosService: ServiciosService) { }

  ngOnInit(): void {
    this.ServiciosService.getAllServicios().subscribe(servicios => this.servicios = servicios);
  }

  search(value: string) {
    this.ServiciosService.getServiciosFilteredByQuery(value).subscribe(servicios => this.servicios = servicios);
  }

}
