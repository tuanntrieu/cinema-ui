import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { noWhiteSpace } from '../../../utils/validator';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth/auth.service';
import { LoginRequest } from '../../../models/auth';
import { ToastService } from '../../../services/toast/toast.service';
import { success } from '../../../utils/constants';
import { CustomerService } from '../../../services/customer/customer.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputTextModule, ReactiveFormsModule, RouterLink, CheckboxModule, PasswordModule, CommonModule, ButtonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  readonly #auth = inject(AuthService);
  readonly #customer = inject(CustomerService);
  readonly #toast = inject(ToastService);
  readonly #router = inject(Router);
  loginForm!: FormGroup;
  submitted = false;
  error = '';

  constructor(private formBuilder: FormBuilder, private location: Location) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, noWhiteSpace()]],
      password: ['', [Validators.required, noWhiteSpace()]]
    });
   
  }

  login() {
    console.log((this.loginForm.valid));
    
    this.submitted = true;
    if (!this.loginForm.valid) {
      return;
    }
    this.#auth.login(this.loginForm.value as LoginRequest).subscribe({
      next: res => {
        if (res.status === success) {
          localStorage.setItem("access_token", res.data.access_token);
          localStorage.setItem("refresh_token", res.data.refresh_token);

          const username = this.#customer.extractUsername();
          if (username) {
            this.#customer.getCustomerInfor(username).subscribe({
              next: (customerRes) => {
                this.#customer.setCurrentUser(customerRes.data);
                this.location.back();
              },
              error: (err) => {
                this.#toast.error('Lấy thông tin người dùng thất bại');
              }
            });
          } else {
            this.#router.navigate(['/']);
          }
        } else {
          this.error = res.message;
        }
      },
      error: (err) => {
        this.#toast.error(err);
      }
    });
  }
}
