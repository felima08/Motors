import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
}

@Component({
  selector: 'app-meu-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="full-screen-container">
      <div class="form-container">
        <div *ngIf="currentView === 'welcome'" class="welcome-panel">
          <h2>Bem-vindo!</h2>
          <p class="welcome-text">Escolha entre <span class="highlight">login</span> e <span class="highlight">cadastro</span> para acessar nossa plataforma.</p>
          <button mat-raised-button color="primary" class="welcome-button" (click)="showLogin()">Login</button>
          <button mat-raised-button color="accent" class="welcome-button" (click)="showRegister()">Cadastrar</button>
        </div>

        <div *ngIf="currentView === 'login'" class="form-panel">
          <div class="panel-content">
            <h2 class="form-title">Entrar</h2>
            <p class="welcome-text">Mantenha-se conectado! Insira suas informações de login para acessar sua conta.</p>

            <form class="login-form" (ngSubmit)="onLoginWithApi()">
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput [(ngModel)]="loginData.email" name="loginEmail" required>
                <mat-icon matSuffix>email</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Senha</mat-label>
                <input matInput [type]="hideLoginPassword ? 'password' : 'text'"
                       [(ngModel)]="loginData.senha" name="loginSenha" required>
                <button mat-icon-button matSuffix (click)="hideLoginPassword = !hideLoginPassword" type="button">
                  <mat-icon>{{hideLoginPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
              </mat-form-field>

              <mat-checkbox class="remember-me" [(ngModel)]="loginData.lembrarMe" name="loginLembrarMe">
                Lembrar-me
              </mat-checkbox>

              <button mat-raised-button color="primary" type="submit" class="submit-button" [disabled]="!loginIsValid()">
                Entrar
              </button>
            </form>

            <button mat-button class="switch-button" (click)="showRegister()">Ainda não tem uma conta? <span class="underline">Cadastre-se</span></button>
          </div>
        </div>

        <div *ngIf="currentView === 'register'" class="form-panel">
          <div class="panel-content">
            <h2 class="form-title">Criar Conta</h2>
            <p class="welcome-text">Comece sua jornada conosco! Preencha o formulário para criar sua nova conta.</p>

            <form class="register-form" (ngSubmit)="onSubmitWithApi()">
              <mat-form-field appearance="outline">
                <mat-label>Nome</mat-label>
                <input matInput [(ngModel)]="formData.nome" name="nome" required>
                <mat-icon matSuffix>person</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput [formControl]="emailFormControl" name="email" required>
                <mat-icon matSuffix>email</mat-icon>
                <mat-error *ngIf="emailFormControl.hasError('email')">Por favor, insira um email válido</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Senha</mat-label>
                <input matInput [type]="hidePassword ? 'password' : 'text'"
                       [(ngModel)]="formData.senha" name="senha" required>
                <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
              </mat-form-field>

              <button mat-raised-button color="accent" type="submit" class="submit-button" [disabled]="!formIsValid()">
                Criar Conta
              </button>
            </form>

            <button mat-button class="switch-button" (click)="showLogin()">Já tem uma conta? <span class="underline">Faça login</span></button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
   .full-screen-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh; /* Força a altura para 100% da viewport */
     
      background-image: url('/pexels-lynxexotics-3802510.jpg'); /* Caminho da imagem */
      background-size: cover; /* Tenta cobrir todo o espaço */
      background-position: center;
      background-repeat: no-repeat;
      
    }

    .form-container {
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      padding: 30px;
      width: 400px;
      text-align: center;
      max-height: 90vh;
      overflow-y: auto;
    }


    .form-panel {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .panel-content {
      width: 100%;
    }

    .form-title {
      color: #1976d2;
      margin-bottom: 20px;
      font-size: 2em;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 15px;
    }

    .remember-me {
      margin-bottom: 15px;
      display: block;
      text-align: left;
    }

    .submit-button {
      width: 100%;
      padding: 12px;
      font-size: 1em;
      background-color: #1976d2;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .submit-button:hover {
      background-color: #115293;
    }

    .switch-button {
      background: none;
      border: none;
      color: #555;
      cursor: pointer;
      margin-top: 10px;
      text-decoration: none;
      font-size: 0.9em;
    }

    .switch-button .underline {
      text-decoration: underline;
      font-weight: bold;
      color: #1976d2;
    }

    /* Estilos para a tela de boas-vindas (mantendo centralizado) */
    .welcome-panel {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #333;
    }

    .welcome-panel h2 {
      font-size: 2.5em;
      margin-bottom: 20px;
      color: #1976d2;
    }

    .welcome-text {
      font-size: 1.1em;
      line-height: 1.8;
      margin-bottom: 30px;
      padding: 0 20px;
    }

    .highlight {
      color: #2196f3;
      font-weight: bold;
    }

    .welcome-button {
      margin: 10px;
      padding: 12px 25px;
      font-size: 1em;
      border-radius: 5px;
    }
  `]
})


export class MeuFormularioComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  formData: any = {};
  loginData: any = {};
  showFormulario = true;
  hidePassword = true;
  hideLoginPassword = true;

  currentView: 'welcome' | 'login' | 'register' = 'welcome';

  private apiService = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.router.events.subscribe(() => {
      this.showFormulario = !this.router.url.includes('/home');
    });
    // Remova a lógica baseada em route.url do constructor
  }

  showLogin() {
    this.currentView = 'login';
  }

  showRegister() {
    this.currentView = 'register';
  }

  showWelcome() {
    this.currentView = 'welcome';
  }

  async onSubmitWithApi() {
    if (this.formIsValid()) {
      const userData = {
        name: this.formData.nome,
        email: this.emailFormControl.value, // Use o valor do FormControl
        password: this.formData.senha
      };

      try {
        const response = await this.apiService.registerUser(userData).toPromise();
        console.log('Cadastro realizado com sucesso:', response);
        this.snackBar.open('Cadastro realizado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.showLogin(); // Redirecionar para o login após o cadastro
        this.resetForm();
      } catch (error: any) {
        console.error('Erro ao cadastrar:', error);
        this.snackBar.open('Erro ao cadastrar. Tente novamente.', 'Fechar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        if (error.error && error.error.message) {
          console.error('Mensagem do servidor:', error.error.message);
          this.snackBar.open(`Erro: ${error.error.message}`, 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      }
    } else {
      this.snackBar.open('Por favor, preencha todos os campos corretamente.', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  async onLoginWithApi() {
    if (!this.loginData.email || !this.loginData.senha) {
      this.snackBar.open('Por favor, preencha todos os campos', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    try {
      const response = await this.apiService.login(this.loginData.email, this.loginData.senha).toPromise();
      if (response && response.length > 0) {
        localStorage.setItem('auth_token', 'token_simulado_' + Date.now());
        localStorage.setItem('user', JSON.stringify(response[0]));

        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
        this.snackBar.open('Login realizado com sucesso! Redirecionando...', 'Fechar', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
        setTimeout(() => {
          this.router.navigateByUrl(returnUrl);
          this.resetLogin();
        }, 2000);
      } else {
        this.snackBar.open('Email ou senha inválidos', 'Fechar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      this.snackBar.open('Erro ao fazer login. Tente novamente.', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  resetForm(): void {
    this.formData = {};
    this.emailFormControl.reset();
  }

  resetLogin(): void {
    this.loginData = {};
  }

  formIsValid(): boolean {
    return !!this.formData.nome &&
           this.emailFormControl.valid &&
           !!this.formData.senha;
  }

  loginIsValid(): boolean {
    return !!this.loginData.email && !!this.loginData.senha;
  }
}