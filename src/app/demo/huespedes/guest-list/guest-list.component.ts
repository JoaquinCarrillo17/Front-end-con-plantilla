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

  constructor(private HuespedesService: HuespedesService) { }

  ngOnInit(): void {
    this.HuespedesService.getAllHuespedes().subscribe(huespedes => this.huespedes = huespedes);
  }



}
