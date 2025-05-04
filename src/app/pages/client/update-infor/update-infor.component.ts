import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastService } from '../../../services/toast/toast.service';
import { CustomerService } from '../../../services/customer/customer.service';
import { DropdownModule } from 'primeng/dropdown';
import { Gender, success } from '../../../utils/constants';
import { jwtDecode } from 'jwt-decode';
import { Customer } from '../../../models/customer';
import { isPhoneNumber, noWhiteSpace } from '../../../utils/validator';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-update-infor',
  standalone: true,
  imports: [InputTextModule, ReactiveFormsModule,
    ConfirmDialogModule, CommonModule,
    ButtonModule, FormsModule, RouterModule, DropdownModule],
  providers: [ConfirmationService],
  templateUrl: './update-infor.component.html',
  styleUrl: './update-infor.component.scss'
})
export class UpdateInforComponent implements OnInit {
  readonly #router = inject(Router);
  readonly #customer = inject(CustomerService);
  readonly #toast = inject(ToastService);
  readonly #confirm = inject(ConfirmationService);
  submitted = false;
  error = '';
  inforForm!: FormGroup;
  user!: Customer;
  email!: string;
  constructor(private formBuilder: FormBuilder) {
  }
  ngOnInit(): void {
    this.email = this.extractUsername();

    this.inforForm = this.formBuilder.group({
      fullName: ['', [Validators.required, noWhiteSpace()]],
      gender: ['', Validators.required],
      phoneNumber: ['', [Validators.required], isPhoneNumber()]
    });

    this.#customer.getCustomerInfor(this.email).subscribe({
      next: (res) => {
        if (res.status === success) {
          this.user = { ...res.data };
          this.inforForm.patchValue({
            ...this.user
          });
        } else {
          this.#toast.error(res.message)
        }
      },
      error: (err) => {
        this.#toast.error(err.message);
      }
    });
  }

  genders = [
    { label: 'Nam', value: Gender.MALE },
    { label: 'Nữ', value: Gender.FEMALE },
  ];
  onInput(){
    this.error='';
  }
  updateInfor() {
    if (!this.inforForm.valid) {
      return;
    }
    const email = this.email;
    this.#customer.updateCustomer({ email, ...this.inforForm.value }).subscribe(
      {
        next: (res) => {
          if (res.status === success) {
            this.#toast.success(res.data.message);
            this.submitted = false;
            if (this.error) {
              this.error = '';
            }
          } else {
            this.#toast.error(res.message)
          }
        }, error: (err) => {
          this.#toast.error(err.message);
        }
      }
    );


  }

  confirm() {
    this.#confirm.confirm({
      message: 'Bạn có chắc muốn thay đổi thông tin ?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.submitted = true;
        this.updateInfor();
      },
      reject: () => {
      }
    });
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

}
