import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Huesped } from '../interfaces/huesped.interface';
import { HuespedesService } from '../services/huespedes.service';

@Component({
  selector: 'app-guest-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './guest-list.component.html',
  styleUrl: './guest-list.component.scss'
})
export class GuestListComponent implements OnInit{

  public huespedes: Huesped[];
  public totalItems: number = 0;
  public query: string = '';
  public pageNumber: number = 0;
  public itemsPerPage: number = 5;

  constructor(private huespedesService: HuespedesService) { }

  ngOnInit(): void {
    this.huespedesService.getAllHuespedes(this.pageNumber, this.itemsPerPage)
      .subscribe(response => {
        this.huespedes = response.huespedes;
        this.totalItems = response.totalItems;
      });
  }

  search(value: string): void {
    this.huespedesService.getHuespedesFilteredByQuery(value, this.pageNumber, this.itemsPerPage)
      .subscribe(response => {
        this.huespedes = response.huespedes;
        this.totalItems = response.totalItems;
        this.query = value;
      });
  }

  onPageChange(value: number): void {
    this.huespedesService.getHuespedesFilteredByQuery(this.query, value, this.itemsPerPage)
      .subscribe(response => {
        this.huespedes = response.huespedes;
        this.totalItems = response.totalItems;
      });
  }

  onItemPerPageChange(value: number): void {
    this.huespedesService.getHuespedesFilteredByQuery(this.query, this.pageNumber, value)
      .subscribe(response => {
        this.huespedes = response.huespedes;
        this.totalItems = response.totalItems;
      });
  }


}
