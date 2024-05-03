import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './demo/pages/authentication/services/auth.service';
import { SessionTimeoutModalService } from './theme/shared/components/session-timeout-modal/services/timeout-modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'JC Hotel Group';

  showSessionTimeoutModal = false;

  constructor(private router: Router, private authService: AuthService, private sessionTimeoutModalService: SessionTimeoutModalService) {
    this.authService.startActivityDetection(); // ? Lo inicializo para que escuche eventos del usuario

    // Escuchar el evento para mostrar el modal de tiempo de sesión
    this.sessionTimeoutModalService.showModal$.subscribe((showModal: boolean) => {
      if (showModal) {
        // Aquí puedes abrir el modal de tiempo de sesión
        // Por ejemplo, puedes establecer una bandera en tu componente principal que controle la visibilidad del modal
        this.showSessionTimeoutModal = true;
      }

    });
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  closeSessionTimeoutModal() {
    this.showSessionTimeoutModal = false;
  }

  handleContinueSession() {
    // Cerrar el modal cuando el usuario hace clic en "Continuar sesión"
    this.closeSessionTimeoutModal();
  }


}
