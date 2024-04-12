import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss', './pagination.component.css']
})
export class PaginationComponent {
  @Input() totalItems: number;
  @Input() currentPage: number = 1;
  @Input() itemsPerPageOptions: number[] = [5, 10, 25, 50];
  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  itemsPerPage: number = 5;
  startIndex: number;
  endIndex: number;
  totalPages: number;
  pages: number[] = [];

  ngOnChanges() {
    this.calculateIndexes();
    this.calculateTotalPages();
    this.generatePageArray();
  }

  changeItemsPerPage() {
    this.itemsPerPageChange.emit(this.itemsPerPage);
    this.calculateIndexes();
  }

  firstPage() {
    this.pageChange.emit(0);
    this.currentPage = 1;
    this.calculateIndexes();
  }

  prevPage() {
    console.log(this.currentPage);
    if (this.currentPage > 0) { // Agregado control para evitar ir a una página negativa
      this.pageChange.emit(this.currentPage - 2);
      this.currentPage = this.currentPage - 1;
      this.calculateIndexes();
    }
  }

  nextPage() {
    console.log(this.currentPage);
    if (this.currentPage <= this.totalPages - 1) { // Evitar ir a una página más allá de la última
      this.pageChange.emit(this.currentPage);
      this.currentPage = this.currentPage + 1;
      this.calculateIndexes();
    }
  }

  lastPage() {
    this.pageChange.emit(this.totalPages-1);
    this.currentPage = this.totalPages;
    this.calculateIndexes();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.pageChange.emit(page-1);
    this.calculateIndexes();
  }

  calculateIndexes() {
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  generatePageArray() {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }
}
