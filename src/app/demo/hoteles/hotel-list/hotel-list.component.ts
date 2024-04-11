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
  styleUrl: './hotel-list.component.scss'
})
export class HotelListComponent implements OnInit {

  public hoteles: Hotel[];

  constructor(private HotelesService: HotelesService) { }

  ngOnInit(): void {
    this.HotelesService.getAllHoteles().subscribe(hoteles => this.hoteles = hoteles);
  }


}
