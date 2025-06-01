import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../../services/toast/toast.service';
import { CustomerService } from '../../../services/customer/customer.service';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CustomerResponse, CustomerSearchRequest } from '../../../models/customer';
import { PaginatorModule } from 'primeng/paginator';
import { success } from '../../../utils/constants';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-customer',
  standalone: true,
  providers: [ConfirmationService],
  imports: [ButtonModule, CommonModule, FormsModule,
    InputTextModule, ConfirmDialogModule, PaginatorModule,
    TableModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {
  readonly #customer = inject(CustomerService);
  readonly #toast = inject(ToastService);
  readonly #confirm = inject(ConfirmationService);
  nameSearch = '';
  customers: CustomerResponse[] = [];
  pagination: PageEvent = { first: 0, rows: 8, page: 0, pageCount: 0 };
  ngOnInit() {
    this.getCustomers();
  }
  getCustomers() {
    const request: CustomerSearchRequest = {
      pageNo: this.pagination.page,
      pageSize: this.pagination.rows,
      sortBy: 'createdDate',
      isAscending: false,
      name: this.nameSearch
    }
    this.#customer.getCustomers(request).subscribe(
      res => {
        if (res.status === success) {
          this.customers = res.data.items;
          this.pagination.page = res.data.pageNo;
          this.pagination.rows = res.data.pageSize;
          this.pagination.pageCount = res.data.totalElements;
          this.pagination.first = res.data.pageNo * res.data.pageSize;
        }
        else {
          this.#toast.error(res.message);
        }
      }
    )
  }
  onPageChange(event: any) {
    this.pagination.page = event.page;
    this.pagination.rows = event.rows;
    this.getCustomers();
  }
  onSearchChange() {
    this.getCustomers();
  }
  onConfrimUnLock(item: CustomerResponse) {
    this.#confirm.confirm({
      message: 'Bạn có chắc muốn mở khóa tài khoản của khách hàng "' + item.name + '" không ?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.#customer.unLoockAccount(item.id).subscribe(
          (res) => {
            if (res.status === success) {
              this.#toast.success(" Mở khóa thành công!");
              this.getCustomers();
            }
            else {
              this.#toast.error(res.message);
            }
          }
        );
      },
      reject: () => {
      }
    });
  }
  onConfrimLock(item: CustomerResponse) {
    this.#confirm.confirm({
      message: 'Bạn có chắc muốn khóa tài khoản của khách hàng "' + item.name + '" không ?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.#customer.lockAccount(item.id).subscribe(
          (res) => {
            if (res.status === success) {
              this.#toast.success("Khóa thành công!");
              this.getCustomers();
            }
            else {
              this.#toast.error(res.message);
            }
          }
        );
      },
      reject: () => {
      }
    });
  }
}
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
