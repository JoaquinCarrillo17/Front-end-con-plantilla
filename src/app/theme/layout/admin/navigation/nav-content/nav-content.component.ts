// angular import
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';

// project import
import { NavigationItem } from '../navigation';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/demo/token/token.service';

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss'],
})
export class NavContentComponent implements OnInit {
  // public props
  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;
  @Output() onNavCollapsedMob = new EventEmitter();
  navigation: any;
  windowWidth: number;

  // constructor
  constructor(
    public nav: NavigationItem,
    private tokenService: TokenService,
    private location: Location,
  ) {
    this.windowWidth = window.innerWidth;
    this.navigation = this.nav.get();
  }

  // life cycle event
  ngOnInit() {
    const userRoles = this.tokenService.getRoles();
    console.log("Roles del usuario: ", userRoles);
    console.log("Token: ", this.tokenService.getToken());

    // Filtra las secciones de navegación basadas en los roles del usuario
    this.navigation.forEach(group => {
      group.children = group.children.filter(item => {
        // Verifica si el item tiene algún rol requerido
        if (item.requiredRoles) {
          // * console.log("Roles requeridos para " + item.title + " : ", item.requiredRoles)
          // Verifica si el usuario tiene al menos uno de los dos roles requeridos para ver el item
          return userRoles.some(role => item.requiredRoles.includes(role));
        }
        // Si el item no tiene roles requeridos, siempre se muestra
        return true;
      });
    });

    console.log(this.navigation)

    if (this.windowWidth < 992) {
      setTimeout(() => {
        document
          .querySelector('.pcoded-navbar')
          .classList.add('menupos-static');
        (
          document.querySelector('#nav-ps-datta') as HTMLElement
        ).style.maxHeight = '100%';
      }, 500);
    }
  }

  // public method
  navMob() {
    if (
      this.windowWidth < 992 &&
      document
        .querySelector('app-navigation.pcoded-navbar')
        .classList.contains('mob-open')
    ) {
      this.onNavCollapsedMob.emit();
    }
  }

  fireOutClick() {
    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent.parentElement.parentElement;
      const last_parent = up_parent.parentElement;
      if (parent.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('pcoded-trigger');
        parent.classList.add('active');
      } else if (up_parent.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('pcoded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('pcoded-trigger');
        last_parent.classList.add('active');
      }
    }
  }
}
