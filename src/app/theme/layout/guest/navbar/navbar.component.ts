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

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

}
