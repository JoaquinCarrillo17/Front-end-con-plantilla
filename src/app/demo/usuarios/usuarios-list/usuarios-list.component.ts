import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Usuario } from '../../pages/authentication/interfaces/usuario.interface';
import { UsuariosService } from '../services/usuarios.service';
import { EditUsuarioComponent } from "../edit-usuario/edit-usuario.component";
import { AddUsuarioComponent } from "../add-usuario/add-usuario.component";
import { TokenService } from '../../token/token.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/theme/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-usuarios-list',
    standalone: true,
    templateUrl: './usuarios-list.component.html',
    styleUrl: './usuarios-list.component.scss',
    imports: [SharedModule]
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

  public puedeCrear: boolean;

  showNotification: boolean = false;
  message: any;
  color: boolean = false;

  constructor(
    private usuariosService: UsuariosService,
    private tokenService: TokenService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadUsuarios();
    this.puedeCrear = this.tokenService.getRoles().includes('ROLE_USUARIOS_W');
  }

  loadUsuarios() {
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

  confirmDeleteUsuario(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Usuario',
        message: '¿Estás seguro de que deseas eliminar este usuario?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUsuario(id);
      }
    });
  }

  deleteUsuario(id: number): void {
    this.usuariosService.deleteUsuario(id).subscribe(
      () => {
        this.showNotification = true;
        this.message = 'Usuario eliminado con éxito';
        this.color = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
        this.pageNumber = 0;
        this.loadUsuarios();
      },
      (error) => {
        this.showNotification = true;
        this.message = 'Error al eliminar el usuario';
        this.color = false;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      }
    );
  }


  abrirModalCrearUsuario(): void {
    const dialogRef = this.dialog.open(AddUsuarioComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((nuevoUsuario: Usuario) => {
      if (nuevoUsuario) {
        this.usuariosService.addUsuario(nuevoUsuario).subscribe(() => {
          this.showNotification = true;
            this.message = 'Operación realizada con éxito';
            this.color = true;
            setTimeout(() => {
              this.showNotification = false;
            }, 3000);
          this.loadUsuarios();
        }, error => {
          this.showNotification = true;
          this.message = 'Error al realizar la operación';
          this.color = false;
          setTimeout(() => {
            this.showNotification = false;
          }, 3000);
        });
      }
    });
  }

  // Método para abrir el modal de edición
  abrirModalEditarUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(EditUsuarioComponent, {
      width: '400px',
      data: usuario, // Pasar el usuario completo al modal
    });

    dialogRef.afterClosed().subscribe((usuarioEditado: Usuario) => {
      if (usuarioEditado) {
        usuarioEditado.id = usuario.id;
        this.usuariosService.editUsuario(usuario.id, usuarioEditado).subscribe(() => {
          this.showNotification = true;
            this.message = 'Operación realizada con éxito';
            this.color = true;
            setTimeout(() => {
              this.showNotification = false;
            }, 3000);
          this.loadUsuarios();
        }, error => {
          this.showNotification = true;
            this.message = 'Error al realizar la operación';
            this.color = false;
            setTimeout(() => {
              this.showNotification = false;
            }, 3000);
        });
      }
    });
  }

}
