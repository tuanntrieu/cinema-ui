import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginRequest } from '../../../models/auth';
import { AuthService } from '../../../services/auth/auth.service';
import { CustomerService } from '../../../services/customer/customer.service';
import { ToastService } from '../../../services/toast/toast.service';
import { success } from '../../../utils/constants';
import { noWhiteSpace } from '../../../utils/validator';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CommonModule, Location } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-loginadmin',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ButtonModule, PasswordModule,
    CommonModule, InputTextModule],
  templateUrl: './loginadmin.component.html',
  styleUrl: './loginadmin.component.scss'
})
export class LoginadminComponent {
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
                this.#router.navigate(['/admin'])
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
