// detalhes.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CarrinhoService } from '../carrinho/carrinho.service';
import { HeaderComponent } from "../header/header.component";
import { FavoritosService } from '../perfil/favoritos.service';// Importe o FavoritosService

interface Car  {
  name: string;
  imageUrl: string;
  price: number;
  description: string;
  destaque?: boolean;
  id?: number;
}

@Component({
  selector: 'app-detalhes',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatSnackBarModule, RouterModule, HeaderComponent],
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.css']
})
export class DetalhesComponent implements OnInit {
  nomeCarro: string = '';
  carro: Car | undefined;
  isFavoritado: boolean = false;
  favoritosService = inject(FavoritosService); // Injete o FavoritosService

  constructor(
    private route: ActivatedRoute,
    private carrinhoServie: CarrinhoService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.nomeCarro = params['nome'];
      this.buscarCarro();
    });
    this.favoritosService.favoritos$.subscribe(favoritos => {
      if (this.carro) {
        this.isFavoritado = favoritos.some(fav => fav.name === this.carro!.name);
      }
    });
  }

  buscarCarro() {
    const carros: Car[] = [
      { id: 1, name: 'Esportivo Azul Veloz', imageUrl: 'pexels-wavyvisuals-377312923-19938881.jpg', price: 75000.00, description: '...' },
      { id: 2, name: 'Sedan Confortável Prata', imageUrl: '...', price: 48000.50, description: '...' },
      { id: 3, name: 'SUV Aventura Cinza', imageUrl: '...', price: 62500.99, description: '...' },
      { id: 4, name: 'Hatch Compacto Vermelho', imageUrl: '...', price: 35200.00, description: '...' },
      { id: 5, name: 'Picape Robusta Preta', imageUrl: '...', price: 88900.00, description: '...' },
      { id: 6, name: 'Elétrico Sustentável Branco', imageUrl: '...', price: 92100.75, description: '...' },
    ];
    this.carro = carros.find(car => car.name.toLowerCase().replace(/ /g, '-') === this.nomeCarro);
    if (this.carro) {
      this.isFavoritado = this.favoritosService.isFavoritado(this.carro);
    }
  }

  adicionarAoCarrinhoNoService(car: Car) {
    this.carrinhoServie.adicionarAoCarrinho(car);
    this.snackBar.open(`${car.name} adicionado ao carrinho!`, 'Fechar', {
      duration: 2000,
    });
  }

  toggleFavorito() {
    if (this.carro) {
      if (this.isFavoritado) {
        this.favoritosService.removerFavorito(this.carro);
        this.isFavoritado = false;
      } else {
        this.favoritosService.adicionarFavorito(this.carro);
        this.isFavoritado = true;
      }
    }
  }
}