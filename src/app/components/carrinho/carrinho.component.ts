import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarrinhoService } from '../carrinho/carrinho.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Subscription } from 'rxjs';
import { HeaderComponent } from "../header/header.component";
import { MatSnackBar } from '@angular/material/snack-bar';
import { FooterComponent } from "../footer/footer.component"; // Remova se não usar aqui

interface CarroCarrinho {
  car: any;
}

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatCardModule,
    MatDividerModule,
    HeaderComponent,
    FooterComponent
],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})
export class CarrinhoComponent implements OnInit, OnDestroy {
  itensCarrinho: CarroCarrinho[] = [];
  total: number = 0;

  private carrinhoService = inject(CarrinhoService);
  // private apiService = inject(ApiService); // Remova
  // private snackBar = inject(MatSnackBar); // Remova
  private router = inject(Router);
  private carrinhoSubscription: Subscription | undefined;
  // showConfirmation: boolean = false; // Remova

  ngOnInit(): void {
    this.carrinhoSubscription = this.carrinhoService.carrinho$.subscribe(cars => {
      this.itensCarrinho = cars.map(car => ({ car }));
      this.calcularTotal();
    });
  }

  ngOnDestroy(): void {
    if (this.carrinhoSubscription) {
      this.carrinhoSubscription.unsubscribe();
    }
  }

  handleImageError(event: any) {
    event.target.src = 'assets/default-car.jpg';
  }

  removerItem(car: any): void {
    this.carrinhoService.removerDoCarrinho(car);
  }

  limparCarrinho(): void {
    this.carrinhoService.limparCarrinho();
  }

  calcularTotal(): void {
    this.total = this.carrinhoService.getTotal();
  }

  prosseguirParaEntrega(): void {
    if (this.itensCarrinho.length > 0) {
      this.router.navigate(['/checkout/entrega']);
    } else {
     
    }
  }

  
}