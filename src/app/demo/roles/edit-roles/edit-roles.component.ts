import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RolesService } from '../services/roles.service';
import { Rol } from '../interfaces/rol.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-rol',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-roles.component.html',
  styleUrl: './edit-roles.component.scss'
})
export class EditRolesComponent implements OnInit {

  @Input() idRol: number;
  @Output() editComplete: EventEmitter<void> = new EventEmitter<void>();
  public rol: Rol = {
    id: 0,
    nombre: "",
    descripcion: "",
    rolesIndirectos: []
  }

  public showEditarRolNotification = false;
  public showEditarRolErrorNotification = false;

  constructor(private rolesService: RolesService) { }

  ngOnInit(): void {
    this.rolesService.getRol(this.idRol).subscribe(data => {
      this.rol = data;
    },
      error => {
        console.log("Error al obtener el rol: " + error)
      })
  }

  editRol() {
    this.rolesService.editRol(this.idRol, this.rol).subscribe(response => {
      this.rol = {
        id: 0,
        nombre: "",
        descripcion: "",
        rolesIndirectos: []
      }
      this.ocultarModalEditarRol();
      this.showEditarRolNotification = true;
      setTimeout(() => {
        this.showEditarRolNotification = false;
      }, 3000);
      window.location.reload();
    }, error => {
      this.showEditarRolErrorNotification = true;
      setTimeout(() => {
        this.showEditarRolErrorNotification = false;
      }, 3000);
    }
  )
  }

  ocultarModalEditarRol() {
    this.editComplete.emit();
  }

}
