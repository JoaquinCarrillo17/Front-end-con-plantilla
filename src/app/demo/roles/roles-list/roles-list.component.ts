import { Component, OnInit } from '@angular/core';
import { RolesService } from '../services/roles.service';
import { Rol } from '../interfaces/rol.interface';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './roles-list.component.html',
  styleUrl: './roles-list.component.scss'
})
export class RolesListComponent implements OnInit {

  isSpinnerVisible: boolean = true;
  public roles: Rol[];
  public totalItems: number = 0;
  public query: string = '';
  public pageNumber: number = 0;
  public itemsPerPage: number = 5;
  public valueSortOrder: string = 'ASC';
  public sortBy: string = 'id';

  constructor(private rolesService: RolesService) { }

  ngOnInit(): void {
    this.rolesService.getAllRolesMagicFilter().subscribe(response => {
      this.roles = response.roles;
      this.totalItems = response.totalItems;
      this.isSpinnerVisible = false;
    },
      (error) => {
        console.error('Error al cargar los roles: ' + error);
        this.isSpinnerVisible = false;
      }
    )
  }

  search(value: string): void {
    this.isSpinnerVisible = true;
    this.rolesService.getRolesFilteredByQuery(value, this.valueSortOrder, this.sortBy, this.pageNumber, this.itemsPerPage)
      .subscribe(response => {
        this.roles = response.roles;
        this.totalItems = response.totalItems;
        this.query = value;
        this.isSpinnerVisible = false;
      },
      (error) => {
        console.error('Error al cargar los servicios:', error);
        this.isSpinnerVisible = false; // En caso de error, también oculta el spinner
      });
  }

  order(columnName: string) {
    let direction = 'ASC';
    if (this.sortBy === columnName) {
      if (this.valueSortOrder === 'ASC') {
        direction = 'DESC';
      } else direction = 'ASC';
    }
    this.sortBy = columnName;
    this.valueSortOrder = direction;
    this.rolesService.getRolesFilteredByQuery(this.query, this.valueSortOrder, this.sortBy, this.pageNumber, this.itemsPerPage).subscribe(response => {
      this.roles = response.roles;
      this.totalItems = response.totalItems;
    });
  }

  onPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.rolesService.getRolesFilteredByQuery(this.query, this.valueSortOrder, this.sortBy, value, this.itemsPerPage)
      .subscribe(response => {
        this.roles = response.roles;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      },
      (error) => {
        console.error('Error al cargar los huespedes:', error);
        this.isSpinnerVisible = false; // En caso de error, también oculta el spinner
      });
  }

  onItemPerPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.rolesService.getRolesFilteredByQuery(this.query, this.valueSortOrder, this.sortBy, this.pageNumber, value)
      .subscribe(response => {
        this.roles = response.roles;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      },
      (error) => {
        console.error('Error al cargar los huespedes:', error);
        this.isSpinnerVisible = false; // En caso de error, también oculta el spinner
      });
  }

}
