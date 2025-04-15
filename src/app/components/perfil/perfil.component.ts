import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule, MatCheckboxModule, MatCardModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <div class="profile-image">
          <img [src]="fotoPerfilUrl" alt="Foto de Perfil">
          <input type="file" (change)="onFileSelected($event)" accept="image/*" style="display: none;" #fileInput>
          <button mat-icon-button color="accent" class="edit-image-button" (click)="fileInput.click()">
            <mat-icon>edit</mat-icon>
          </button>
        </div>
        <h1>{{ nomeUsuario }}</h1>
        <p class="email">{{ email }}</p>
      </div>

      <mat-card class="profile-card">
        <mat-card-title>Informações Pessoais</mat-card-title>
        <mat-card-content>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nome</mat-label>
            <input matInput type="text" [value]="nomeUsuario" disabled>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" [value]="email" disabled>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Número de Telefone</mat-label>
            <input matInput type="tel" [(ngModel)]="telefone">
            <mat-icon matSuffix>phone</mat-icon>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="salvarTelefone()">Salvar Telefone</button>
        </mat-card-content>
      </mat-card>

      <mat-card class="profile-card">
        <mat-card-title>Alterar Senha</mat-card-title>
        <mat-card-content>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Senha Atual</mat-label>
            <input matInput type="password" [(ngModel)]="senhaAtual">
            <mat-icon matSuffix>lock</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nova Senha</mat-label>
            <input matInput type="password" [(ngModel)]="novaSenha">
            <mat-icon matSuffix>lock_open</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Confirmar Nova Senha</mat-label>
            <input matInput type="password" [(ngModel)]="confirmarNovaSenha">
            <mat-icon matSuffix>lock_outline</mat-icon>
          </mat-form-field>
          <button mat-raised-button color="warn" (click)="alterarSenha()">Alterar Senha</button>
          <div *ngIf="mensagemSenha" class="password-message">{{ mensagemSenha }}</div>
        </mat-card-content>
      </mat-card>

      <mat-card class="profile-card">
        <mat-card-title>Outras Configurações</mat-card-title>
        <mat-card-content>
          <mat-checkbox class="full-width" [(ngModel)]="receberNotificacoes" (change)="salvarNotificacoes()">Receber notificações por email</mat-checkbox>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .profile-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 30px;
    }

    .profile-image {
      position: relative;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer; /* Adiciona cursor para indicar que é clicável */
    }

    .profile-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .profile-image input[type="file"] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }

    .edit-image-button {
      position: absolute;
      bottom: -10px;
      right: -10px;
      background-color: rgba(0, 0, 0, 0.6);
      color: white;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .edit-image-button mat-icon {
      font-size: 18px;
    }

    .profile-header h1 {
      margin-top: 0;
      margin-bottom: 5px;
      color: #3f51b5;
    }

    .profile-header .email {
      color: #777;
      margin-bottom: 15px;
    }

    .profile-card {
      width: 100%;
      max-width: 600px;
      margin-bottom: 20px;
    }

    .profile-card mat-card-title {
      background-color: #f5f5f5;
      padding: 16px;
      border-bottom: 1px solid #eee;
      color: #3f51b5;
    }

    .profile-card mat-card-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
    }

    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }

    .password-message {
      margin-top: 10px;
      color: green;
      font-weight: bold;
    }
  `],
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

  constructor(
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      try {
        const user = JSON.parse(loggedInUser);
        this.nomeUsuario = user.name || 'Nome do Usuário';
        this.email = user.email || 'email@exemplo.com';
        this.telefone = user.telefone || '';
        this.receberNotificacoes = user.receberNotificacoes || false;
        this.userId = user.id || null;
        this.fotoPerfilUrl = user.fotoPerfilUrl || this.fotoPerfilUrl;
      } catch (error) {
        console.error('Erro ao parsear loggedInUser do localStorage:', error);
        this.snackBar.open('Erro ao carregar os dados do perfil.', 'Fechar', { duration: 3000 });
      }
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.uploadProfileImage();
    }
  }

  uploadProfileImage() {
    if (this.userId && this.selectedFile) {
      const fileName = this.selectedFile.name; // Pegamos o nome do arquivo para simulação
      this.apiService.uploadProfileImage(this.userId, fileName)
        .subscribe({
          next: (response: any) => {
            this.snackBar.open('Foto de perfil atualizada com sucesso!', 'Fechar', { duration: 2000 });
            this.fotoPerfilUrl = response.fotoPerfilUrl; // Assumindo que o backend retorna a URL
            const loggedInUserString = localStorage.getItem('loggedInUser');
            if (loggedInUserString) {
              try {
                const loggedInUser = JSON.parse(loggedInUserString);
                loggedInUser.fotoPerfilUrl = this.fotoPerfilUrl;
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
              } catch (error) {
                console.error('Erro ao atualizar localStorage:', error);
              }
            }
          },
          error: (error) => {
            this.snackBar.open('Erro ao atualizar a foto de perfil.', 'Fechar', { duration: 3000 });
            console.error('Erro ao atualizar a foto de perfil:', error);
          }
        });
    } else {
      this.snackBar.open('Usuário não identificado ou nenhuma imagem selecionada.', 'Fechar', { duration: 3000 });
    }
  }

  salvarTelefone() {
    if (this.userId) {
      this.apiService.updateUser(this.userId, { telefone: this.telefone })
        .subscribe({
          next: (response) => {
            this.snackBar.open('Telefone atualizado com sucesso!', 'Fechar', { duration: 2000 });
            const loggedInUserString = localStorage.getItem('loggedInUser');
            if (loggedInUserString) {
              try {
                const loggedInUser = JSON.parse(loggedInUserString);
                loggedInUser.telefone = this.telefone;
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
              } catch (error) {
                console.error('Erro ao atualizar loggedInUser no localStorage:', error);
              }
            }
          },
          error: (error) => {
            this.snackBar.open('Erro ao atualizar o telefone.', 'Fechar', { duration: 3000 });
            console.error('Erro ao atualizar o telefone:', error);
          }
        });
    } else {
      this.snackBar.open('Usuário não identificado, não foi possível salvar o telefone.', 'Fechar', { duration: 3000 });
    }
  }

  alterarSenha() {
    if (this.novaSenha === this.confirmarNovaSenha) {
      if (this.userId) {
        this.apiService.updateUser(this.userId, { password: this.novaSenha })
          .subscribe({
            next: (response) => {
              this.mensagemSenha = 'Senha alterada com sucesso!';
              this.snackBar.open(this.mensagemSenha, 'Fechar', { duration: 2000 });
              this.senhaAtual = '';
              this.novaSenha = '';
              this.confirmarNovaSenha = '';
            },
            error: (error) => {
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
          next: (response) => {
            this.snackBar.open(`Notificações por email ${this.receberNotificacoes ? 'ativadas' : 'desativadas'} com sucesso!`, 'Fechar', { duration: 2000 });
            const loggedInUserString = localStorage.getItem('loggedInUser');
            if (loggedInUserString) {
              try {
                const loggedInUser = JSON.parse(loggedInUserString);
                loggedInUser.receberNotificacoes = this.receberNotificacoes;
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
              } catch (error) {
                console.error('Erro ao atualizar loggedInUser no localStorage:', error);
              }
            }
          },
          error: (error) => {
            this.snackBar.open('Erro ao atualizar as configurações de notificação.', 'Fechar', { duration: 3000 });
            console.error('Erro ao atualizar as notificações:', error);
          }
        });
    } else {
      this.snackBar.open('Usuário não identificado, não foi possível salvar as configurações de notificação.', 'Fechar', { duration: 3000 });
    }
  }
}