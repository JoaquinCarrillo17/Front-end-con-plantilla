import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Usuario } from '../../pages/authentication/interfaces/usuario.interface';
import { UsuariosService } from '../services/usuarios.service';
import { EditUsuarioComponent } from "../edit-usuario/edit-usuario.component";
import { AddUsuarioComponent } from "../add-usuario/add-usuario.component";
import { TokenService } from '../../token/token.service';

@Component({
    selector: 'app-usuarios-list',
    standalone: true,
    templateUrl: './usuarios-list.component.html',
    styleUrl: './usuarios-list.component.scss',
    imports: [SharedModule, EditUsuarioComponent, AddUsuarioComponent]
})
export class UsuariosListComponent implements OnInit{

  isSpinnerVisible: boolean = true;
  public usuarios: Usuario[];
  public totalItems: number = 0;
  public query: string = '';
  public pageNumber: number = 0;
  public itemsPerPage: number = 5;
  public valueSortOrder: string = 'ASC';
  public sortBy: string = 'id';

  public mostrarModalEliminar = false;
  public mostrarModalEditarCrear = false;
  accionModal: 'editar' | 'crear' = 'editar';

  public showBorrarUsuarioNotification = false;
  public showBorrarUsuarioErrorNotification = false;

  public puedeCrear: boolean;

  public idUsuario: number; // ? Para saber que rol tiene que ser editado/creado

  constructor(private usuariosService: UsuariosService, private tokenService: TokenService) { }

  ngOnInit(): void {
    this.usuariosService.getAllUsuariosMagicFilter().subscribe(response => {
      this.usuarios = response.usuarios;
      this.totalItems = response.totalItems;
      this.isSpinnerVisible = false;
    },
      (error) => {
        console.error('Error al cargar los roles: ' + error);
        this.isSpinnerVisible = false;
      }
    );

    this.puedeCrear = this.tokenService.getRoles().includes('ROLE_USUARIOS_W');
  }

  search(value: string): void {
    this.isSpinnerVisible = true;
    this.usuariosService.getUsuariosFilteredByQuery(value, this.valueSortOrder, this.sortBy, this.pageNumber, this.itemsPerPage)
      .subscribe(response => {
        this.usuarios = response.usuarios;
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
    this.usuariosService.getUsuariosFilteredByQuery(this.query, this.valueSortOrder, this.sortBy, this.pageNumber, this.itemsPerPage).subscribe(response => {
      this.usuarios = response.usuarios;
      this.totalItems = response.totalItems;
    });
  }

  onPageChange(value: number): void {
    this.isSpinnerVisible = true;
    this.usuariosService.getUsuariosFilteredByQuery(this.query, this.valueSortOrder, this.sortBy, value, this.itemsPerPage)
      .subscribe(response => {
        this.usuarios = response.usuarios;
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
    this.usuariosService.getUsuariosFilteredByQuery(this.query, this.valueSortOrder, this.sortBy, this.pageNumber, value)
      .subscribe(response => {
        this.usuarios = response.usuarios;
        this.totalItems = response.totalItems;
        this.isSpinnerVisible = false;
      },
      (error) => {
        console.error('Error al cargar los usuario:', error);
        this.isSpinnerVisible = false; // En caso de error, también oculta el spinner
      });
  }

  // ? Editar/crear/borrar rol

  deleteUsuario(){
    this.usuariosService.deleteUsuario(this.idUsuario).subscribe(response => {
      this.showBorrarUsuarioNotification = true;
      setTimeout(() => {
        this.showBorrarUsuarioNotification = false;
      }, 3000);
      window.location.reload();
    }, error => {
      this.showBorrarUsuarioErrorNotification = true;
      setTimeout(() => {
        this.showBorrarUsuarioErrorNotification = false;
      }, 3000);
    })
  }

  mostrarModalEditarCrearUsuario(idUsuario: number) {
    this.idUsuario = idUsuario;
    this.mostrarModalEditarCrear = true;
    this.accionModal = 'editar';
  }

  ocultarModalEditarCrearUsuario() {
    this.mostrarModalEditarCrear = false;
  }

  mostrarModalEliminarUsuario(idUsuario: number) {
    this.idUsuario = idUsuario;
    this.mostrarModalEliminar = true;
  }

  ocultarModalEliminarUsuario() {
    this.mostrarModalEliminar = false;
  }

  onFloatingButtonClick() {
    this.mostrarModalEditarCrear = true;
    this.accionModal = 'crear'
  }

}
