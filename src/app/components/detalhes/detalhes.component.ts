// detalhes.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CarrinhoService,  } from '../carrinho/carrinho.service'; // Importe a interface Car
import { HeaderComponent } from "../header/header.component";
import { FavoritosService } from '../perfil/favoritos.service';// Importe o FavoritosService

interface Car {
  name: string;
  imageUrl: string;
  price: number;
  description: string;
  destaque?: boolean;
  id?: string;
  vendido?: boolean;
  estoque?: number;
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
    ) { }

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
            { id: '1', name: 'Esportivo Azul Veloz', imageUrl: 'carro azul esportivo.jpg', price: 75000.00, description: '...', vendido: false, estoque: 5 },
            { id: '2', name: 'Sedan Confortável Vermelho', imageUrl: 'prata.jpg', price: 48000.50, description: 'a', vendido: false, estoque: 3 },
            { id: '3', name: 'SUV Aventura Cinza', imageUrl: 'suv cinza.jpg', price: 62500.99, description: '...', vendido: false, estoque: 2 },
            { id: '4', name: 'Hatch Compacto Vermelho', imageUrl: 'Hatch Compacto Vermelho.jpg', price: 35200.00, description: '...', vendido: false, estoque: 7 },
            { id: '5', name: 'Picape Robusta Preta', imageUrl: 'Picape Robusta Preta.jpg', price: 88900.00, description: '...', vendido: true, estoque: 0 },
            { id: '6', name: 'Elétrico Sustentável Branco', imageUrl: 'Elétrico Sustentável Branco.jpg', price: 92100.75, description: '...', vendido: false, estoque: 8 },
        ];
        this.carro = carros.find(car => car.name.toLowerCase().replace(/ /g, '-') === this.nomeCarro);
        if (this.carro) {
            this.isFavoritado = this.favoritosService.isFavoritado(this.carro);
        }

        if (this.carro?.vendido) {
            this.carro = undefined; // Se o carro estiver vendido, defina 'carro' como undefined para simular "não encontrado"
            console.log('Veículo vendido. Detalhes não disponíveis.');
        } else if (!this.carro) {
            console.log('Carro não encontrado para:', this.nomeCarro);
        }
    }

    adicionarAoCarrinhoNoService(car: Car) {
        if (car && car.id) {
            this.carrinhoServie.adicionarAoCarrinho({ ...car, id: String(car.id) });
            this.snackBar.open(`${car.name} adicionado ao carrinho!`, 'Fechar', {
                duration: 2000,
            });
        } else {
            console.warn('Carro ou ID inválido ao tentar adicionar ao carrinho.');
        }
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