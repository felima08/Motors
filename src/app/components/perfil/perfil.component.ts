import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule, MatCheckboxModule, MatCardModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <div class="profile-image">
          <img src="assets/default-profile.png" alt="Foto de Perfil">
          <button mat-icon-button color="accent" class="edit-image-button">
            <mat-icon>edit</mat-icon>
          </button>
        </div>
        <h1>Nome do Usuário</h1>
        <p class="email"></p>
      </div>

      <mat-card class="profile-card">
        <mat-card-title>Informações Pessoais</mat-card-title>
        <mat-card-content>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nome</mat-label>
            <input matInput type="text" value="Nome do Usuário" disabled>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" value="email@exemplo.com" disabled>
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
          <mat-checkbox class="full-width">Receber notificações por email</mat-checkbox>
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
    }

    .profile-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .edit-image-button {
      position: absolute;
      bottom: 0;
      right: 0;
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
export class PerfilComponent {
  telefone: string = '';
  senhaAtual: string = '';
  novaSenha: string = '';
  confirmarNovaSenha: string = '';
  mensagemSenha: string = '';

  constructor(private snackBar: MatSnackBar) { }

  salvarTelefone() {
    console.log('Função salvarTelefone() chamada');
    this.snackBar.open('Funcionalidade de salvar telefone será implementada aqui.', 'Fechar', { duration: 2000 });
    // Lógica para salvar o telefone no backend virá aqui
  }

  alterarSenha() {
    console.log('Função alterarSenha() chamada');
    if (this.novaSenha === this.confirmarNovaSenha) {
      this.mensagemSenha = 'Funcionalidade de alterar senha será implementada aqui.';
      this.snackBar.open(this.mensagemSenha, 'Fechar', { duration: 2000 });
      // Lógica para verificar senha atual e salvar nova senha virá aqui
      this.senhaAtual = '';
      this.novaSenha = '';
      this.confirmarNovaSenha = '';
    } else {
      this.mensagemSenha = 'As novas senhas não coincidem.';
      this.snackBar.open(this.mensagemSenha, 'Fechar', { duration: 3000 });
    }
  }
}