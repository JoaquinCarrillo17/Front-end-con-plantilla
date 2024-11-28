import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent implements OnInit {
  @Input() label: string = '';
  @Input() minDate: string = '';
  @Input() model: string = ''; // El valor actual
  @Input() condition: boolean = false;
  @Input() message: string = '';
  @Output() modelChange = new EventEmitter<string>();

  today: string = '';

  ngOnInit() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    this.today = `${year}-${month}-${day}`;

    // Si no se pasa minDate, usar hoy como predeterminado
    if (!this.minDate) {
      this.minDate = this.today;
    }
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement; // Castear el evento como HTMLInputElement
    this.model = input.value;
    this.modelChange.emit(this.model);
  }
}
