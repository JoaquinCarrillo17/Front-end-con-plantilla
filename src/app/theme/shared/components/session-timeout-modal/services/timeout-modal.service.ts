import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class SessionTimeoutModalService  {
  private showModalSubject = new Subject<boolean>();

  showModal$ = this.showModalSubject.asObservable();

  constructor() { }

  showModal(show: boolean) {
    this.showModalSubject.next(show);
  }

}
