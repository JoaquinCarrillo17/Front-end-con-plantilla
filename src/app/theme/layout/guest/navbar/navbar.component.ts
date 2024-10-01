import { CommonModule } from "@angular/common";
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {

  ngOnInit(): void { }

  constructor(private router: Router) { }

  goToLogin(): void {
    this.router.navigate(['/auth/login']); 
  }

}
