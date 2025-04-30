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
import { FooterComponent } from "../footer/footer.component";
import { ChatOnlineComponent } from '../chat-online/chat-online.component';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule

interface CarroCarrinho {
  car: any;
}

interface Cupom {
  id: number;
  codigo: string;
  desconto: number;
}

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ChatOnlineComponent,
    MatIconModule,
    RouterLink,
    MatCardModule,
    MatDividerModule,
    HeaderComponent,
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
  ],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})
export class CarrinhoComponent implements OnInit, OnDestroy {
  itensCarrinho: CarroCarrinho[] = [];
  total: number = 0;
  cupomDigitado: string = ''; // Nova propriedade
  descontoAplicado: number = 0; // Nova propriedade

  private carrinhoService = inject(CarrinhoService);
  private apiService = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private carrinhoSubscription: Subscription | undefined;
  showConfirmation: boolean = false;

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
    this.total = this.carrinhoService.getTotal() - this.descontoAplicado;
  }

  aplicarCupom(): void {
    if (this.cupomDigitado) {
      this.apiService.get<Cupom[]>(`cupons?codigo=${this.cupomDigitado}`).subscribe(
        (cupons) => {
          if (cupons && cupons.length > 0) {
            const cupomValido = cupons[0];
            const subtotal = this.carrinhoService.getTotal();
            this.descontoAplicado = subtotal * (cupomValido.desconto / 100);
            this.calcularTotal();
            this.snackBar.open('Cupom aplicado com sucesso!', 'Fechar', { duration: 2000 });
          } else {
            this.snackBar.open('Cupom inválido.', 'Fechar', { duration: 2000 });
            this.descontoAplicado = 0;
            this.calcularTotal();
          }
        },
        (error) => {
          console.error('Erro ao validar o cupom:', error);
          this.snackBar.open('Erro ao validar o cupom.', 'Fechar', { duration: 2000 });
          this.descontoAplicado = 0;
          this.calcularTotal();
        }
      );
    } else {
      this.snackBar.open('Por favor, insira um código de cupom.', 'Fechar', { duration: 2000 });
      this.descontoAplicado = 0;
      this.calcularTotal();
    }
  }

  prosseguirParaEntrega(): void {
    if (this.itensCarrinho.length > 0) {
      
      this.router.navigate(['/checkout/entrega'], { queryParams: { totalComDesconto: this.total } });
    } else {
     
    }
  }
}