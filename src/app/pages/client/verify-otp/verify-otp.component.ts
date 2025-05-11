import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth/auth.service';
import { success } from '../../../utils/constants';
import { ToastService } from '../../../services/toast/toast.service';
import { VerifyOtpRequest } from '../../../models/auth';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss',
})
export class VerifyOtpComponent implements OnInit {
  otpForm: FormGroup;
  otpControls = new Array(6);
  error: string = '';
  countdown: number = 120000;
  intervalId: any;
  email!: string;
  readonly #router = inject(Router);
  readonly #auth = inject(AuthService);
  readonly #toast = inject(ToastService);
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.otpForm = this.fb.group({});
    for (let i = 0; i < 6; i++) {
      this.otpForm.addControl(
        'digit' + i,
        new FormControl('', [Validators.required, Validators.pattern('[0-9]')])
      );
    }
  }

  ngOnInit(): void {
    this.startCountdown();
    const email = localStorage.getItem('otpEmail');
    if (email) this.email = email;
    else this.#router.navigate(['/send-otp'])
  }

  startCountdown() {
    const storedTime = localStorage.getItem('otpStartTime');
    const startTime = storedTime ? parseInt(storedTime) : Date.now();

    const elapsed = Date.now() - startTime;

    const remaining = 120000 - elapsed;

    this.countdown = remaining > 0 ? remaining : 0;

    if (this.countdown > 0) {
      this.intervalId = setInterval(() => {
        this.countdown -= 1000;
        if (this.countdown <= 0) {
          clearInterval(this.intervalId);
          this.countdown = 0;
          localStorage.removeItem('otpStartTime');
        }
      }, 1000);
    } 
  }

  resendOtp() {
    const email = this.email;
    this.#auth.sendOtp({ email }).subscribe({
      next: (res) => {
        if (res.status === success) {
          localStorage.setItem('otpStartTime', Date.now().toString());
          this.startCountdown();
        }
        else {
          this.#toast.error(res.message);
        }
      },
      error: (err) => { this.#toast.error(err) }
    });
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (/^[0-9]$/.test(value)) {
      this.otpForm.get('digit' + index)?.setValue(value);

      if (index < 5) {
        const nextControl = this.otpForm.get('digit' + (index + 1));
        if (nextControl && !nextControl.value) {
          const nextInput = document.querySelectorAll<HTMLInputElement>('.otp-input')[index + 1];
          nextInput?.focus();
        }
      }
    } else {
      input.value = '';
      this.otpForm.get('digit' + index)?.setValue('');
    }
  }

  handleKey(event: KeyboardEvent, index: number) {
    const key = event.key;

    if (key === 'ArrowRight' && index < 5) {
      const next = document.querySelectorAll<HTMLInputElement>('.otp-input')[index + 1];
      next?.focus();
    } else if (key === 'ArrowLeft' && index > 0) {
      const prev = document.querySelectorAll<HTMLInputElement>('.otp-input')[index - 1];
      prev?.focus();
    } else if (key === 'Backspace') {
      const control = this.otpForm.get('digit' + index);
      if (control && !control.value && index > 0) {
        const prev = document.querySelectorAll<HTMLInputElement>('.otp-input')[index - 1];
        prev?.focus();
      }
    }
  }

  preventSkipFocus(event: FocusEvent, index: number) {
    if (index === 0) return;

    for (let i = 0; i < index; i++) {
      if (!this.otpForm.get('digit' + i)?.value) {
        (event.target as HTMLInputElement).blur();
        return;
      }
    }
  }

  verifyOtp() {
    if (!this.otpForm.valid) {
      this.error = 'Vui lòng nhập mã xác thực!';
      return;
    } else {
      const rq: VerifyOtpRequest = {
        email: this.email,
        otp: Number(Object.values(this.otpForm.value).join(''))
      }
      this.#auth.verifyOtp(rq).subscribe({
        next: (res) => {
          if (res.data === true) {
            localStorage.setItem('isVerify', "true")
            this.#router.navigate(['/forget-password']);
          } else {
            this.error = 'Mã xác thực không đúng!';
          }
        }
      });
    }


  }
}
