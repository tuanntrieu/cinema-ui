import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { isEmail, isValidPassword, noWhiteSpace, passwordNotMatch } from '../../../utils/validator';
import { AuthService } from '../../../services/auth/auth.service';
import { success } from '../../../utils/constants';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [InputTextModule, ReactiveFormsModule, RouterLink, CheckboxModule, PasswordModule, CommonModule, ButtonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  regForm!: FormGroup;
  submitted = false;
  error = '';
  readonly #router = inject(Router);
  readonly #auth = inject(AuthService);
  readonly #toast = inject(ToastService);



  constructor(private formBuilder: FormBuilder) {
  }
  ngOnInit() {
    this.regForm = this.formBuilder.group(
      {
        email: ["", [Validators.required, noWhiteSpace()], [isEmail()]],
        password: ["", [Validators.required, noWhiteSpace(), isValidPassword()]],
        confirmPassword: ["", [Validators.required]],
        fullName: ["", [Validators.required, noWhiteSpace()]]
      },
      { validators: [passwordNotMatch('password', 'confirmPassword')] }
    );
  }

  onInput(){
    this.error='';
  }
  register() {
    this.submitted = true;
    if (this.regForm.invalid) {
      return;
    }

    this.#auth.register({ ...this.regForm.value }).subscribe(
      {
        next: (res) => {
          if (res.status === success) {
            this.#toast.success(res.data.message);
            this.#router.navigate(['/login']);
          } else {
            this.error = res.message;
          }
        }, error: (err) => {
          this.#toast.error(err)
        }
      }
    )
  }
}
