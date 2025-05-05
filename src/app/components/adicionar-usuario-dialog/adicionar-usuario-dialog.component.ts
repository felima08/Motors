import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adicionar-usuario-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogTitle, // Importe os "pedaços" do diálogo que você usa no template
    MatDialogContent,
    MatDialogActions,
    CommonModule
  ],
  templateUrl: './adicionar-usuario-dialog.component.html',
  styleUrls: ['./adicionar-usuario-dialog.component.css']
})
export class AdicionarUsuarioDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AdicionarUsuarioDialogComponent>,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id: ['',Validators.required],
      name: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      status: ['ativo']
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSalvarClick(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}