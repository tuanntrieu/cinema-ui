import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../services/auth/auth.service';
import { CustomerService } from '../../../services/customer/customer.service';
import { ToastService } from '../../../services/toast/toast.service';
import { isEmail, noWhiteSpace } from '../../../utils/validator';
import { jwtDecode } from 'jwt-decode';
import { success } from '../../../utils/constants';

@Component({
  selector: 'app-send-otp',
  standalone: true,
  imports: [InputTextModule, ReactiveFormsModule, RouterLink, CheckboxModule, PasswordModule, CommonModule, ButtonModule, FormsModule, RouterModule],
  templateUrl: './send-otp.component.html',
  styleUrl: './send-otp.component.scss'
})
export class SendOtpComponent {
  readonly #auth = inject(AuthService);
  readonly #toast = inject(ToastService);
  readonly #router = inject(Router);
  sendOtpForm!: FormGroup;
  submitted = false;
  error = '';

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.sendOtpForm = this.formBuilder.group({
      email: ['', [Validators.required, noWhiteSpace()], [isEmail()]],
    });
  }
  send() {
    this.submitted = true;
    if (this.sendOtpForm.invalid) {
      return;
    }
    console.log({ ...this.sendOtpForm.value });
    this.#auth.sendOtp({ ...this.sendOtpForm.value }).subscribe(
      {
        next: (res) => {
          if (res.status === success) {
            localStorage.setItem('otpStartTime', Date.now().toString());
            localStorage.setItem('otpEmail', this.sendOtpForm.value.email);
            this.#router.navigate(['/verify-otp'])
          }
          else {
            this.error = res.message;
          }
        }
      }
    );

  }
  onInput() {
    this.error = '';
  }

}
