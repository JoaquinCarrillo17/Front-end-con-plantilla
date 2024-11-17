import { CommonModule, Location } from "@angular/common";
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";

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

  showDropdown = false;

  toggleDropdown() {
    if (localStorage.getItem('auth_token') === null) {
      this.goToLogin()
    } else this.showDropdown = !this.showDropdown;
  }

  constructor(
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit(): void {
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  logOut() {
    localStorage.removeItem('auth_token');
    this.showDropdown = false;

    this.router.navigate(['/']).then(() => {
      console.log(this.location.path())
      if (this.location.path() === '') {
        window.location.reload();
      }
    });
  }


}
