import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastService } from '../../../services/toast/toast.service';
import { success } from '../../../utils/constants';
import { noWhiteSpace, isValidPassword, passwordNotMatch } from '../../../utils/validator';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ButtonModule, DividerModule, FormsModule, PasswordModule, ReactiveFormsModule, CommonModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  readonly #auth = inject(AuthService);
  readonly #toast = inject(ToastService);
  readonly #router = inject(Router);
  forgetForm!: FormGroup;
  submitted = false;
  error = '';
  email = '';
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.forgetForm = this.formBuilder.group({

      password: ["", [Validators.required, noWhiteSpace(), isValidPassword()]],
      confirmPassword: ['', [Validators.required, noWhiteSpace()]]
    },
      { validators: [passwordNotMatch('password', 'confirmPassword')] });
    const verify = localStorage.getItem('isVerify');
    const email = localStorage.getItem('otpEmail');
    if (email) this.email = email;
    if (!verify)
      if (email)
        this.#router.navigate(['/verify-otp'])
      else this.#router.navigate(['/send-otp'])
  }

  forget() {
    if (!this.forgetForm.valid) {
      return;
    }
    const email = this.email;
    this.#auth.forgetPassword({ email, ...this.forgetForm.value }).subscribe(
      {
        next: (res) => {
          console.log(res);
          if (res.status === success) {
            this.#toast.success(res.data.message);
            this.#router.navigate(['/login'])
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
  
}
