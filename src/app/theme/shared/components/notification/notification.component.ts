import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  @Input() message: string;
  @Input() showNotification: boolean;

  public hacerAnimacion: boolean = false;


}
