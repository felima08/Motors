import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CarrinhoService } from '../carrinho/carrinho.service';

interface Car {
  name: string;
  imageUrl: string;
  price: number;
  description: string;
}

@Component({
  selector: 'app-detalhes',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="detalhes-container">
      <h2>Detalhes do Carro</h2>
      <div *ngIf="carro">
        <h3>{{ carro.name }}</h3>
        <img [src]="carro.imageUrl" alt="{{ carro.name }}" class="carro-imagem">
        <p class="preco">R$ {{ carro.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</p>
        <p class="descricao">{{ carro.description }}</p>
        <button mat-raised-button color="primary" (click)="adicionarAoCarrinhoNoService(carro)">
          <mat-icon>add_shopping_cart</mat-icon> Adicionar ao Carrinho
        </button>
        <button mat-button color="accent" routerLink="/home">Voltar para a Loja</button>
      </div>
      <div *ngIf="!carro">
        <p>Carro não encontrado.</p>
      </div>
    </div>
  `,
  styles: [`
    /* ... seus estilos CSS do DetalhesComponent ... */
  `],
})
export class DetalhesComponent implements OnInit {
  nomeCarro: string = '';
  carro: Car | undefined;

  constructor(
    private route: ActivatedRoute,
    private carrinhoServie:CarrinhoService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.nomeCarro = params['nome'];
      this.buscarCarro();
    });
  }

  buscarCarro() {
    const carros: Car[] = [
      { name: 'Esportivo Azul Veloz', imageUrl: './assets/esportivo_azul.jpg', price: 75000.00, description: 'Um carro esportivo elegante e potente para quem busca adrenalina.' },
      { name: 'Sedan Confortável Prata', imageUrl: './assets/sedan_prata.jpg', price: 48000.50, description: 'Ideal para a família, oferece conforto e segurança em cada viagem.' },
      { name: 'SUV Aventura Cinza', imageUrl: './assets/suv_cinza.jpg', price: 62500.99, description: 'Pronto para qualquer aventura, com espaço e robustez para o seu dia a dia.' },
      { name: 'Hatch Compacto Vermelho', imageUrl: './assets/hatch_vermelho.jpg', price: 35200.00, description: 'Ágil e econômico, perfeito para a cidade.' },
      { name: 'Picape Robusta Preta', imageUrl: './assets/picape_preta.jpg', price: 88900.00, description: 'Força e capacidade para o trabalho e lazer.' },
      { name: 'Elétrico Sustentável Branco', imageUrl: './assets/eletrico_branco.jpg', price: 92100.75, description: 'O futuro da mobilidade, com zero emissão e alta tecnologia.' },
    ];
    this.carro = carros.find(car => car.name.toLowerCase().replace(/ /g, '-') === this.nomeCarro);
  }

  // Método para adicionar o carro ao carrinho USANDO o CarrinhoService
  adicionarAoCarrinhoNoService(car: Car) {
    this.carrinhoServie.adicionarAoCarrinho(car);
    this.snackBar.open(`${car.name} adicionado ao carrinho!`, 'Fechar', {
      duration: 2000,
    });
  }
}