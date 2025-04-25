// src/app/components/perfil/perfil.component.ts
import { Component, OnInit, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FavoritosService } from './favoritos.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { CarComponent } from '../models/car/car.component';
import { ChatOnlineComponent } from '../chat-online/chat-online.component';

interface PedidoResumo {
  idPedido: string;
  dataPedido: Date;
  valorTotal: number;
  usuarioId: string;
}

interface User {
  id?: number;
  name?: string;
  email?: string;
  telefone?: string;
  fotoPerfilUrl?: string;
  receberNotificacoes?: boolean;
  cpf?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatOnlineComponent , MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule, MatCheckboxModule, MatCardModule, RouterLink, MatGridListModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  telefone: string = '';
  senhaAtual: string = '';
  novaSenha: string = '';
  confirmarNovaSenha: string = '';
  mensagemSenha: string = '';
  nomeUsuario: string = '';
  email: string = '';
  receberNotificacoes: boolean = false;
  userId: number | null = null;
  fotoPerfilUrl: string = 'símbolo-de-perfil-masculino-inteligente-retrato-estilo-desenho-animado-mínimo-166146853.webp';
  selectedFile: File | null = null;
  favoritosService = inject(FavoritosService);
  carrosFavoritos: CarComponent[] = [];
  mostrarFavoritos: boolean = false;

  cpf: string = '';
  endereco: string = '';
  cidade: string = '';
  estado: string = '';
  cep: string = '';

  editarDadosPessoais: boolean = false; // Nova variável para controlar a edição
  seusPedidos: PedidoResumo[] = []; // Adicione esta linha

  constructor(
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const loggedInUserString = localStorage.getItem('loggedInUser');
      if (loggedInUserString) {
        try {
          const user: User = JSON.parse(loggedInUserString);
          this.nomeUsuario = user.name || 'Nome do Usuário';
          this.email = user.email || 'email@exemplo.com';
          this.telefone = user.telefone || '';
          this.receberNotificacoes = user.receberNotificacoes || false;
          this.userId = user.id || null;
          this.fotoPerfilUrl = user.fotoPerfilUrl || this.fotoPerfilUrl;
          this.cpf = user.cpf || '';
          this.endereco = user.endereco || '';
          this.cidade = user.cidade || '';
          this.estado = user.estado || '';
          this.cep = user.cep || '';
        } catch (error: any) {
          console.error('Erro ao parsear loggedInUser do localStorage:', error);
          this.snackBar.open('Erro ao carregar os dados do perfil.', 'Fechar', { duration: 3000 });
        }
      }
      this.favoritosService.favoritos$.subscribe(favoritos => {
        this.carrosFavoritos = favoritos;
      });
      this.carregarPedidosDoUsuario(); // Chame a função para carregar os pedidos
    }
  }

  carregarPedidosDoUsuario(): void {
    this.apiService.getPedidosDoUsuario().subscribe({ // Remova o this.userId daqui
      next: (pedidos: PedidoResumo[]) => {
        if (this.userId) {
          this.seusPedidos = pedidos.filter(pedido => pedido.usuarioId === String(this.userId));
        } else {
          this.seusPedidos = [];
          this.snackBar.open('Usuário não identificado.', 'Fechar', { duration: 3000 });
        }
      },
      error: (error: any) => {
        console.error('Erro ao carregar os pedidos do usuário:', error);
        this.snackBar.open('Erro ao carregar os seus pedidos.', 'Fechar', { duration: 3000 });
      }
    });
    // Simulação de dados (remova quando a API estiver integrada)
    // this.seusPedidos = [
    //   { idPedido: 'PED001', dataPedido: new Date('2025-04-20'), valorTotal: 123.45 },
    //   { idPedido: 'PED002', dataPedido: new Date('2025-04-22'), valorTotal: 678.90 },
    // ];
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.uploadProfileImage();
    }
  }

  uploadProfileImage() {
    if (this.userId && this.selectedFile) {
      const fileName = this.selectedFile.name;
      this.apiService.uploadProfileImage(this.userId, fileName)
        .subscribe({
          next: (response: any) => {
            this.snackBar.open('Foto de perfil atualizada com sucesso!', 'Fechar', { duration: 2000 });
            this.fotoPerfilUrl = response.fotoPerfilUrl;
            this.atualizarLocalStorage({ fotoPerfilUrl: this.fotoPerfilUrl });
          },
          error: (error: any) => {
            this.snackBar.open('Erro ao atualizar a foto de perfil.', 'Fechar', { duration: 3000 });
            console.error('Erro ao atualizar a foto de perfil:', error);
          }
        });
    } else {
      this.snackBar.open('Usuário não identificado ou nenhuma imagem selecionada.', 'Fechar', { duration: 3000 });
    }
  }

  alternarEditarDadosPessoais() {
    this.editarDadosPessoais = !this.editarDadosPessoais;
  }

  salvarDadosPessoais() {
    if (this.userId && this.editarDadosPessoais) {
      this.apiService.updateUser(this.userId, { telefone: this.telefone, cpf: this.cpf })
        .subscribe({
          next: (response: any) => {
            this.snackBar.open('Dados pessoais atualizados com sucesso!', 'Fechar', { duration: 2000 });
            this.atualizarLocalStorage({ telefone: this.telefone, cpf: this.cpf });
            this.editarDadosPessoais = false; // Desabilita a edição após salvar
          },
          error: (error: any) => {
            this.snackBar.open('Erro ao atualizar os dados pessoais.', 'Fechar', { duration: 3000 });
            console.error('Erro ao atualizar os dados pessoais:', error);
          }
        });
    } else if (!this.userId) {
      this.snackBar.open('Usuário não identificado, não foi possível salvar os dados pessoais.', 'Fechar', { duration: 3000 });
    }
  }

  alterarSenha() {
    if (this.novaSenha === this.confirmarNovaSenha) {
      if (this.userId) {
        this.apiService.updateUser(this.userId, { password: this.novaSenha })
          .subscribe({
            next: (response: any) => {
              this.mensagemSenha = 'Senha alterada com sucesso!';
              this.snackBar.open(this.mensagemSenha, 'Fechar', { duration: 2000 });
              this.senhaAtual = '';
              this.novaSenha = '';
              this.confirmarNovaSenha = '';
            },
            error: (error: any) => {
              this.mensagemSenha = 'Erro ao alterar a senha.';
              this.snackBar.open(this.mensagemSenha, 'Fechar', { duration: 3000 });
              console.error('Erro ao alterar a senha:', error);
            }
          });
      } else {
        this.snackBar.open('Usuário não identificado, não foi possível alterar a senha.', 'Fechar', { duration: 3000 });
      }
    } else {
      this.mensagemSenha = 'As novas senhas não coincidem.';
      this.snackBar.open(this.mensagemSenha, 'Fechar', { duration: 3000 });
    }
  }

  salvarNotificacoes() {
    if (this.userId) {
      this.apiService.updateUser(this.userId, { receberNotificacoes: this.receberNotificacoes })
        .subscribe({
          next: (response: any) => {
            this.snackBar.open(`Notificações por email ${this.receberNotificacoes ? 'ativadas' : 'desativadas'} com sucesso!`, 'Fechar', { duration: 2000 });
            this.atualizarLocalStorage({ receberNotificacoes: this.receberNotificacoes });
          },
          error: (error: any) => {
            this.snackBar.open('Erro ao atualizar as configurações de notificação.', 'Fechar', { duration: 3000 });
            console.error('Erro ao atualizar as notificações:', error);
          }
        });
    } else {
      this.snackBar.open('Usuário não identificado, não foi possível salvar as configurações de notificação.', 'Fechar', { duration: 3000 });
    }
  }

  salvarEndereco() {
    if (this.userId) {
      this.apiService.updateUser(this.userId, { endereco: this.endereco, cidade: this.cidade, estado: this.estado, cep: this.cep })
        .subscribe({
          next: (response: any) => {
            this.snackBar.open('Endereço atualizado com sucesso!', 'Fechar', { duration: 2000 });
            this.atualizarLocalStorage({ endereco: this.endereco, cidade: this.cidade, estado: this.estado, cep: this.cep });
          },
          error: (error: any) => {
            this.snackBar.open('Erro ao atualizar o endereço.', 'Fechar', { duration: 3000 });
            console.error('Erro ao atualizar o endereço:', error);
          }
        });
    } else {
      this.snackBar.open('Usuário não identificado, não foi possível salvar o endereço.', 'Fechar', { duration: 3000 });
    }
  }

  private atualizarLocalStorage(updates: Partial<User>) {
    const loggedInUserString = localStorage.getItem('loggedInUser');
    if (loggedInUserString) {
      try {
        const loggedInUser: User = JSON.parse(loggedInUserString);
        const updatedUser = { ...loggedInUser, ...updates };
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
      } catch (error: any) {
        console.error('Erro ao atualizar localStorage:', error);
      }
    }
  }

  alternarMostrarFavoritos(): void {
    this.mostrarFavoritos = !this.mostrarFavoritos;
  }
}

