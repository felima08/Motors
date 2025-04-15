import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule, MatCheckboxModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
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