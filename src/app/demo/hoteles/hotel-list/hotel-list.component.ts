import { Component, OnInit } from '@angular/core';
import { Hotel } from '../interfaces/hotel.interface';
import { HotelesService } from '../services/hoteles.service';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [],
  templateUrl: './hotel-list.component.html',
  styleUrl: './hotel-list.component.scss'
})
export class HotelListComponent implements OnInit {

  public hoteles : Hotel[];

  constructor(private HotelesService: HotelesService) {}

  ngOnInit(): void {
    this.HotelesService.getAllHoteles().subscribe( hoteles => this.hoteles = hoteles);
  }

}
