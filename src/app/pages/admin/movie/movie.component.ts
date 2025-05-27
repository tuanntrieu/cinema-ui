import { Component, inject } from '@angular/core';
import { MovieResponse, MovieSearchRequest } from '../../../models/movie';
import { MovieService } from '../../../services/moive/movie.service';
import { ToastService } from '../../../services/toast/toast.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { success } from '../../../utils/constants';

@Component({
  selector: 'app-movie',
  standalone: true,
  providers: [ConfirmationService],
  imports: [CommonModule, TableModule, ButtonModule, ConfirmDialogModule,
    InputTextModule, PaginatorModule, RouterModule, RouterModule],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss'
})
export class MovieComponent {
  readonly #toast = inject(ToastService);
  readonly #movie = inject(MovieService);
  readonly #confirm = inject(ConfirmationService);
  pagination: PageEvent = { first: 0, rows: 5, page: 0, pageCount: 0 };
  movieList: MovieResponse[] = [];
  nameSearch = '';
  ngOnInit() {
    this.getMovie();

  }
  onPageChange(event: any) {
    this.pagination.page = event.page;
    this.pagination.rows = event.rows;
    this.getMovie();
  }
  getMovie() {
    const request: MovieSearchRequest = {
      pageNo: this.pagination.page,
      pageSize: this.pagination.rows,
      sortBy: 'id',
      isAscending: false,
      cinemaId: 0,
      dateSearch: new Date(),
      name: this.nameSearch
    };
    this.#movie.getAllMovie(request).subscribe({
      next: (res: any) => {
        this.movieList = res.data.items;
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
  confirmDelete(movie: MovieResponse) {
    this.#confirm.confirm({
      message: 'Bạn có chắc muốn xóa phimphim "' + movie.name + '" không ?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.#movie.deleteMovie(movie.id).subscribe(
          (res) => {
            if (res.status === success) {
              this.#toast.success("Xóa thành công!");
              this.getMovie();
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
