import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-session-timeout-modal',
  templateUrl: './session-timeout-modal.component.html',
  styleUrl: './session-timeout-modal.component.scss'
})
export class SessionTimeoutModalComponent {

  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  continueSession() {
    // Emitir el evento para cerrar el modal
    this.closeModal.emit();
  }

}
