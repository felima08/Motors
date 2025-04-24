// meu-formulario.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

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
  templateUrl: './meu-formulario.component.html',
  styleUrls: ['./meu-formulario.component.css']
})
export class MeuFormularioComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  forgotPasswordEmailControl = new FormControl('', [Validators.required, Validators.email]); // Adicionado
  formData: any = {};
  loginData: any = {};
  showFormulario = true;
  hidePassword = true;
  hideLoginPassword = true;

  currentView: 'welcome' | 'login' | 'register' | 'forgotPassword' = 'welcome';

  private apiService = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.router.events.subscribe(() => {
      this.showFormulario = !this.router.url.includes('/home');
    });
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

  showForgotPassword() {
    this.currentView = 'forgotPassword';
  }

  async onForgotPassword() {
    if (this.forgotPasswordEmailControl.valid && this.forgotPasswordEmailControl.value) { // Verificação adicional de valor não nulo
      try {
        const response = await this.apiService.requestPasswordReset(this.forgotPasswordEmailControl.value).toPromise();
        this.snackBar.open('Um link de redefinição de senha foi enviado para o seu e-mail (simulação).', 'Fechar', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.currentView = 'login'; // Voltar para o login após a solicitação (simulação)
      } catch (error) {
        console.error('Erro ao solicitar redefinição de senha:', error);
        this.snackBar.open('Ocorreu um erro ao solicitar a redefinição de senha.', 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    } else {
      this.snackBar.open('Por favor, insira um e-mail válido.', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
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
        localStorage.setItem('loggedInUser', JSON.stringify(response[0]));

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