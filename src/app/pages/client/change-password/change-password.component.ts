import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastService } from '../../../services/toast/toast.service';
import { isValidPassword, noWhiteSpace, passwordNotMatch } from '../../../utils/validator';
import { CommonModule } from '@angular/common';
import { success } from '../../../utils/constants';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-change-password',
  standalone: true,
  providers: [ConfirmationService],
  imports: [ButtonModule, DividerModule, ConfirmDialogModule, FormsModule, PasswordModule, ReactiveFormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
  readonly #auth = inject(AuthService);
  readonly #toast = inject(ToastService);
  readonly #router = inject(Router);
  readonly #confirm = inject(ConfirmationService);
  changePassForm!: FormGroup;
  submitted = false;
  error = '';
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.changePassForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, noWhiteSpace()]],
      password: ["", [Validators.required, noWhiteSpace(), isValidPassword()]],
      confirmPassword: ['', [Validators.required, noWhiteSpace()]]
    },
      { validators: [passwordNotMatch('password', 'confirmPassword')] })
      ;
  }

  changePassword() {
    if (!this.changePassForm.valid) {
      return;
    }
    const email = this.extractUsername();
    this.#auth.changePassworod({ email, ...this.changePassForm.value }).subscribe(
      {
        next: (res) => {
          console.log(res);
          if (res.status === success) {
            this.#toast.success(res.data.message);
            this.changePassForm.reset();
            this.submitted = false;
            if (this.error) {
              this.error = '';
            }
          }
          else {
            this.error = res.message;
          }
        },
        error: (err) => {
          this.#toast.error(err)
        }
      }
    );
  }
  extractUsername(): string {
    const token = localStorage.getItem("access_token");
    if (token) {
      const tokenDecode = jwtDecode(token) as { sub: string };
      if (tokenDecode.sub) {
        return tokenDecode.sub;
      }
    }
    return "";
  }
  confirm() {
    this.#confirm.confirm({
      message: 'Bạn có chắc muốn đổi mật khẩu không?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.submitted = true;
        this.changePassword();
      },
      reject: () => {
      }
    });
  }
}
