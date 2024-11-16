import { CommonModule } from "@angular/common";
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { UbicacionService } from "src/app/demo/ubicacion/ubicacion.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule
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
