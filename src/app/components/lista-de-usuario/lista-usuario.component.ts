import { Component, OnInit, viewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { User } from './user';
import { UserService } from './user.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCard } from '@angular/material/card';
import { MatCardFooter } from '@angular/material/card';
import { MatCardContent } from '@angular/material/card';
import { MatCardModule } from '@angular/material/card';
import { ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer,MatDrawerContainer } from '@angular/material/sidenav';
import { MatNavList,MatListItem } from '@angular/material/list';
import { MatDrawerContent } from '@angular/material/sidenav';















@Component({
  selector: 'app-lista-usuario',
  imports: [MatTableModule, MatPaginatorModule, MatCard, MatCardFooter, MatCardContent, MatPaginatorModule, MatCardModule, MatButton, MatFormFieldModule, MatSort, MatInputModule, MatSortModule,MatMenuModule,MatIconModule,MatToolbarModule,MatButtonModule,MatDrawer,MatDrawerContainer, MatNavList,MatListItem,MatDrawerContent],
  providers: [UserService],
  templateUrl: './lista-usuario.component.html',
  styleUrl: './lista-usuario.component.css'
})
export class ListaUsuarioComponent implements OnInit {
  FilterChange($event: KeyboardEvent) {
    throw new Error('Method not implemented.');
  }

  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.userService.list().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource<User>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;




      },
      error: (error) => {
        console.log(error);
        console.log('deu errado');
      }


    })


  }




  displayedColumns: string[] = ['id', 'name', 'telefone', 'email', 'status', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource!: MatTableDataSource<User>;


  Filterchange(data: Event) {
    const value = (data.target as HTMLInputElement).value
    this.dataSource.filter = value;
  }


}

