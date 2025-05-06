import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast/toast.service';
import { MovieService } from '../../../services/moive/movie.service';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { PaginatorModule } from 'primeng/paginator';
import { MovieResponse, MovieSearchRequest } from '../../../models/movie';
import { success } from '../../../utils/constants';
import { MoiveCardComponent } from '../../../components/client/moive-card/moive-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TabMenuModule, PaginatorModule, MoiveCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly #toast = inject(ToastService);
  readonly #router = inject(Router);
  readonly #movie = inject(MovieService);

  menuItems: MenuItem[] = [];
  activeItem: MenuItem | undefined;
  movieList: any;
  pagination: PageEvent = { first: 0, rows: 4, page: 0, pageCount: 0 };
  cinemaId: number = 0;
  dateSearch!: Date;
  tab!: string;


  ngOnInit() {
    const id = localStorage.getItem("selectedId");
    if (id) this.cinemaId = Number(id);

    this.initMenu();
    this.getMoviesByDate();
  }

  private initMenu() {
    this.menuItems = [
      { label: 'PHIM ĐANG CHIẾU', id: 'now' },
      { label: 'PHIM SẮP CHIẾU', id: 'coming' }
    ];
    this.activeItem = this.menuItems[0];
    this.tab = 'now';
  }

  onActiveItemChange(item: MenuItem) {
    if (item) {
      this.tab = item.id === 'coming' ? 'coming' : 'now';
      this.pagination.page = 0;
      this.tab === 'coming' ? this.getMoviesComingSoon() : this.getMoviesByDate();
    }
  }

  onPageChange(event: any) {
    this.pagination.page = event.page;
    this.pagination.rows = event.rows;

    this.tab === 'coming' ? this.getMoviesComingSoon() : this.getMoviesByDate();
  }

  getMoviesByDate() {
    const request: MovieSearchRequest = {
      pageNo: this.pagination.page,
      pageSize: this.pagination.rows,
      sortBy: 'created_date',
      isAscending: false,
      cinemaId: this.cinemaId,
      dateSearch: new Date()
    };

    this.#movie.getMoviesByDate(request).subscribe({
      next: (res: any) => {
        console.log(res.data);
        this.handleMovieResponse(res);
      },
      error: (err: any) => {
        this.#toast.error(err);
      }
    });
  }

  getMoviesComingSoon() {
    const request: MovieSearchRequest = {
      pageNo: this.pagination.page,
      pageSize: this.pagination.rows,
      sortBy: 'created_date',
      isAscending: false,
      cinemaId: this.cinemaId,
      dateSearch: new Date()
    };

    this.#movie.getMoviesCoomingSoon(request).subscribe({
      next: (res: any) => {
        console.log(request);
        this.handleMovieResponse(res);
      },
      error: (err: any) => {
        this.#toast.error(err);
      }
    });
  }

  private handleMovieResponse(res: any) {
    if (res.status === success) {
      this.movieList = [];
      this.pagination.pageCount = res.data.totalElements;
      res.data.items.forEach((movie: any) => {
        this.movieList.push({ ...movie })
      });
    } else {
      this.#toast.error(res.message);
    }
  }
}

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
