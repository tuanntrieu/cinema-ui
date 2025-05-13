import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CustomerService } from '../../../services/customer/customer.service';
import { TicketService } from '../../../services/ticket/ticket.service';
import { ToastService } from '../../../services/toast/toast.service';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { Customer } from '../../../models/customer';
import { PaginationStateService } from '../../../services/pagination/pagination-state.service';
import { TicketRequest, TicketResponse } from '../../../models/ticket';
import { success } from '../../../utils/constants';
import { TableModule } from 'primeng/table';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [PaginatorModule, FormsModule, TableModule,
    DatePipe, ButtonModule, CalendarModule,
    DialogModule, CommonModule, CurrencyPipe],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent {
  readonly #toast = inject(ToastService);
  readonly #customer = inject(CustomerService);
  readonly #ticket = inject(TicketService);
  readonly #datePipe = inject(DatePipe);
  pagination: PageEvent = { first: 0, rows: 4, page: 0, pageCount: 0 };
  user!: Customer;
  readonly stateKey = "order-history";
  readonly #paginationState = inject(PaginationStateService);
  email = '';
  tickets: TicketResponse[] = [];
  date: Date | undefined;
  visible = false;

  ngOnInit(): void {
    const paginationState = this.#paginationState.getPaginationState(this.stateKey);
    this.pagination.page = paginationState.page;
    this.pagination.rows = paginationState.rows;
    const username = this.#customer.getCurrentUser();
    if (username) {
      this.email = username;
      this.#customer.currentUser$.subscribe(user => {
        if (user) {
          this.user = user;
          this.getTicket();
        }
      })
    }

  }
  getTicket() {
    const request: TicketRequest = {
      pageNo: this.pagination.page,
      pageSize: this.pagination.rows,
      sortBy: 'createdDate',
      isAscending: false,
      customerId: this.user.id,
      dateOrder: this.date ?? null
    };
    this.#ticket.getTicketsByCustomer(request).subscribe({
      next: (res) => {
        if (res.status === success) {
          this.tickets = res.data.items;
          this.pagination.page = res.data.pageNo;
          this.pagination.rows = res.data.pageSize;
          this.pagination.pageCount = res.data.totalElements;
          this.pagination.first = this.pagination.page * this.pagination.rows;
        }
      }, error: (error) => {
        this.#toast.error(error)
      }
    });
  }
  onPageChange(event: any) {
    this.pagination.page = event.page;
    this.pagination.rows = event.rows;
    this.#paginationState.setPaginationState(this.stateKey, {
      page: this.pagination.page,
      rows: this.pagination.rows
    });
    this.getTicket();
  }
  onChange(date: any) {
    const formatted = this.#datePipe.transform(date, 'yyyy-MM-dd');
    if (formatted) {
      this.date = new Date(formatted);
      this.getTicket();
    }
  }
  clearDate() {
    this.date = undefined;
    this.getTicket();
  }

  ticketDetail!: TicketResponse;
  onViewDetail(id: string) {
    this.#ticket.getTicketById(id).subscribe(
      (res) => {
        if (res.status === success) {
          this.ticketDetail = res.data;
          this.visible = true;
        } else {
          this.#toast.error(res.message);
        }
      }
    )
  }
  @ViewChild('ticketContent') ticketContent!: ElementRef;
  printPDF() {
    const element = document.getElementById("ticketContent");
    console.log(element);
    if (!element) return;
    const options = {
      margin: 0.5,
      filename: 'vephim.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().from(element).set(options).save();

  }
}


interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
