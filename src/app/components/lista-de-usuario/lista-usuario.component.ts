import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { User } from './user';
import { UserService } from './user.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCard, MatCardContent, MatCardFooter, MatCardModule } from '@angular/material/card';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AdicionarUsuarioDialogComponent } from '../adicionar-usuario-dialog/adicionar-usuario-dialog.component';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import {  OnDestroy } from '@angular/core';

@Component({
  selector: 'app-lista-usuario',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSortModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule
],
  providers: [UserService],
  templateUrl: './lista-usuario.component.html',
  styleUrl: './lista-usuario.component.css',
  standalone: true, 
})
export class ListaUsuarioComponent implements OnInit {


  constructor(private userService: UserService, public dialog: MatDialog) { }

  ngOnDestroy(): void {
 this.destroy$.next();
 this.destroy$.complete();
  };

  ngOnInit(): void {
    this.userService.list().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource<User>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
      }
    });
  }

  displayedColumns: string[] = ['id', 'name', 'telefone', 'email', 'status', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
   private readonly destroy$ = new Subject<void>();

  dataSource!: MatTableDataSource<User>;

  editarUsuario(): void{
    const dialogRef = this.dialog.open(AdicionarUsuarioDialogComponent,{ 
      width: '400px',
      

    });


    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.userService.update(result).subscribe({
          next: (usuarioAtualizado: User) => {
            const index = this.dataSource.data.findIndex(u => u.id === usuarioAtualizado.id);
            if (index >= 0) {
              this.dataSource.data[index] = usuarioAtualizado;
              this.dataSource.data = [...this.dataSource.data];
            }
          }
        });
      }
    });
     }

    deletarUsuario(id: number): void{
  if (confirm('tem certeza que deseja excluir este usuario')){
     this.userService.delete(id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(u => u.id !== id);
      }
     });
  }
    
    }

  

  Filterchange(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  adicionarNovoUsuario(): void {
    const dialogRef = this.dialog.open(AdicionarUsuarioDialogComponent, {
      width: '400px',
    });
  
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      console.log('O diálogo foi fechado', result);
      if (result) {
        this.userService.create(result).pipe(takeUntil(this.destroy$)).subscribe({
          next: (novoUsuarioDoBackend) => {
            console.log('Resposta do json-server:', novoUsuarioDoBackend);
            this.dataSource.data = [...this.dataSource.data, novoUsuarioDoBackend];
            this.paginator.firstPage();
            this.dataSource.paginator = this.paginator;
            this.dataSource._updateChangeSubscription();
            console.log('Usuário adicionado com sucesso:', novoUsuarioDoBackend);
          },
          error: (error: any) => {
            console.error('Erro ao adicionar usuário:', error);
          }
        });
      }
    });
  }
}