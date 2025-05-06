import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MovieService } from '../../../services/moive/movie.service';
import { ToastService } from '../../../services/toast/toast.service';
import { CommonModule } from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';
import { MovieSearchRequest } from '../../../models/movie';
import { success } from '../../../utils/constants';
import { PaginatorModule } from 'primeng/paginator';
import { MoiveCardComponent } from '../../../components/client/moive-card/moive-card.component';

@Component({
  selector: 'app-showtimes',
  standalone: true,
  imports: [CommonModule, TabMenuModule, PaginatorModule, MoiveCardComponent],
  templateUrl: './showtimes.component.html',
  styleUrl: './showtimes.component.scss'
})
export class ShowtimesComponent {
  readonly #toast = inject(ToastService);
  readonly #router = inject(Router);
  readonly #movie = inject(MovieService);

  menuItems: MenuItem[] = [];
  activeItem: MenuItem | undefined;
  movieList: any;
  pagination: PageEvent = { first: 0, rows: 4, page: 0, pageCount: 0 };
  cinemaId: number = 0;
  tabDate: string = '';

  ngOnInit() {
    const id = localStorage.getItem("selectedId");
    if (id) this.cinemaId = Number(id);

    this.generate7DayTabs();
    this.activeItem = this.menuItems[0];
    this.tabDate = this.menuItems[0].id!;
    this.getMoviesByDate();
  }

  generate7DayTabs(): void {
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const isoDate = date.toISOString().split('T')[0];
      const label = date.toLocaleDateString('vi-VN', {
        weekday: 'short', day: '2-digit', month: '2-digit'
      });

      this.menuItems.push({
        label,
        id: isoDate
      });
    }
  }

  onActiveItemChange(item: MenuItem) {
    if (item?.id) {
      this.tabDate = item.id;
      this.pagination.page=0;
      this.getMoviesByDate();
    }
  }

  onPageChange(event: any) {
    this.pagination.page = event.page;
    this.pagination.rows = event.rows;
    this.getMoviesByDate();
  }

  getMoviesByDate() {
    const request: MovieSearchRequest = {
      pageNo: this.pagination.page,
      pageSize: this.pagination.rows,
      sortBy: 'created_date',
      isAscending: false,
      cinemaId: this.cinemaId,
      dateSearch: new Date(this.tabDate)
    };

    this.#movie.getMoviesByDate(request).subscribe({
      next: (res: any) => {
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
