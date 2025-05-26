import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { CinemaService } from '../../../services/cinema/cinema.service';

import { ToastService } from '../../../services/toast/toast.service';
import { CinemaResponse, CinemaSearchRequest } from '../../../models/cinema';

@Component({
  selector: 'app-cinema',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule,
    InputTextModule, PaginatorModule],
  templateUrl: './cinema.component.html',
  styleUrl: './cinema.component.scss'
})
export class CinemaComponent {
  readonly #toast = inject(ToastService);
  readonly #cinema = inject(CinemaService);
  pagination: PageEvent = { first: 0, rows: 5, page: 0, pageCount: 0 };
  cinemas: CinemaResponse[] = [];
  nameSearch = '';
  ngOnInit() {
    this.getCinemas();

  }
  getCinemas() {
    const request: CinemaSearchRequest = {
      pageNo: this.pagination.page,
      pageSize: this.pagination.rows,
      sortBy: 'id',
      isAscending: false,
      name: this.nameSearch
    };
    this.#cinema.getAllCinemaPage(request).subscribe({
      next: (res: any) => {
        this.cinemas = res.data.items;
        this.pagination.page = res.data.pageNo;
        this.pagination.rows = res.data.pageSize;
        this.pagination.pageCount = res.data.totalElements;
        this.pagination.first = res.data.pageNo * res.data.pageSize;
      },
      error: (err: any) => {
        this.#toast.error(err);
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
