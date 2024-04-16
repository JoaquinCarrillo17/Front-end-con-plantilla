import { Component, OnInit } from '@angular/core';
import { Hotel } from '../interfaces/hotel.interface';
import { HotelesService } from '../services/hoteles.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss', './hotel-list.component.css']
})
export class HotelListComponent implements OnInit {

  isSpinnerVisible: boolean = true; // Agrega una variable para controlar la visibilidad del spinner
  public hoteles: Hotel[];
  public totalItems: number = 0;
  public query: string = '';
  public pageNumber: number = 0;
  public itemsPerPage: number = 5;

  constructor(private hotelesService: HotelesService) { }

  ngOnInit(): void {
    this.hotelesService.getAllHotelesMagicFilter(this.pageNumber, this.itemsPerPage).subscribe(response => {
      this.hoteles = response.hoteles;
      this.totalItems = response.totalItems;
      this.isSpinnerVisible = false;
    },
      (error) => {
        console.error('Error al cargar los hoteles:', error);
        this.isSpinnerVisible = false; // En caso de error, también oculta el spinner
      }
    );
  }

  search(value: string) {
    this.isSpinnerVisible = true;
    this.hotelesService.getHotelesFilteredByQuery(value, this.pageNumber, this.itemsPerPage).subscribe(response => {
      this.hoteles = response.hoteles;
      this.totalItems = response.totalItems;
      this.query = value;
      this.isSpinnerVisible = false;
    });
  }

  onPageChange(value: number) {
    this.isSpinnerVisible = true;
    this.hotelesService.getHotelesFilteredByQuery(this.query, value, this.itemsPerPage).subscribe(response => { // TODO : cuando cambio de la pagina 1 a la 2, siempre mando coger 5 items por pagina (por defecto), si antes de cambiar de pagina he cambiado los items por pagina se me jode
      this.hoteles = response.hoteles;
      this.totalItems = response.totalItems;
      this.isSpinnerVisible = false;
    });
  }

  onItemPerPageChange(value: number) {
    this.isSpinnerVisible = true
    this.itemsPerPage = value; // Para que me actualice el valor que por defecto tengo a 5
    this.hotelesService.getHotelesFilteredByQuery(this.query, this.pageNumber, value).subscribe(response => {
      this.hoteles = response.hoteles;
      this.totalItems = response.totalItems;
      this.isSpinnerVisible = false;
    });
  }



}
