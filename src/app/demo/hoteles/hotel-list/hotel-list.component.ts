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

  public hoteles: Hotel[];
  query: string = '';

  constructor(private HotelesService: HotelesService) { }

  ngOnInit(): void {
    this.HotelesService.getAllHoteles().subscribe(hoteles => this.hoteles = hoteles);
  }

  buscarHoteles() {
    // Aquí puedes agregar la lógica para buscar hoteles según la consulta
    console.log('Buscando hoteles con la consulta:', this.query);
    // Llama a tu servicio o realiza la búsqueda directamente aquí
  }

  search(value: string) {
    // Aquí gestionas el valor de búsqueda
    console.log('Valor de búsqueda:', value);
    // Llama a tu función de búsqueda aquí
  }


}
