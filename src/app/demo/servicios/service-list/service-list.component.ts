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

  isSpinnerVisible: boolean = true;
  public servicios: Servicio[];
  public totalItems: number = 0;
  public query: string = '';
  public pageNumber: number = 0;
  public itemsPerPage: number = 5;

  constructor(private serviciosService: ServiciosService) { }

  ngOnInit(): void {
    this.serviciosService.getAllServicios(this.pageNumber, this.itemsPerPage)
      .subscribe(response => {
        this.servicios = response.servicios;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      });
  }

  search(value: string): void {
    this.isSpinnerVisible = true;
    this.serviciosService.getServiciosFilteredByQuery(value, this.pageNumber, this.itemsPerPage)
      .subscribe(response => {
        this.servicios = response.servicios;
        this.totalItems = response.totalItems;
        this.query = value;
        this.isSpinnerVisible = false;
      });
  }

  onPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.serviciosService.getServiciosFilteredByQuery(this.query, value, this.itemsPerPage)
      .subscribe(response => {
        this.servicios = response.servicios;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      });
  }

  onItemPerPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.serviciosService.getServiciosFilteredByQuery(this.query, this.pageNumber, value)
      .subscribe(response => {
        this.servicios = response.servicios;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      });
  }

}
