import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MovieService } from '../../../services/moive/movie.service';
import { ToastService } from '../../../services/toast/toast.service';
import { CommonModule } from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';
import { MovieResponse, MovieSearchRequest } from '../../../models/movie';
import { success } from '../../../utils/constants';
import { PaginatorModule } from 'primeng/paginator';
import { MoiveCardComponent } from '../../../components/client/moive-card/moive-card.component';
import { PaginationStateService } from '../../../services/pagination/pagination-state.service';
import { DialogModule } from 'primeng/dialog';
import { ScheduleCardComponent } from '../../../components/client/schedule-card/schedule-card.component';
import { ScheduleForCinemaResponse } from '../../../models/schedule';
import { ScheduleService } from '../../../services/schedule/schedule.service';

@Component({
  selector: 'app-showtimes',
  standalone: true,
  imports: [CommonModule, TabMenuModule, PaginatorModule, MoiveCardComponent, DialogModule, ScheduleCardComponent],
  templateUrl: './showtimes.component.html',
  styleUrl: './showtimes.component.scss'
})
export class ShowtimesComponent {
  readonly stateKey = "showtimes";
  readonly #toast = inject(ToastService);
  readonly #router = inject(Router);
  readonly #movie = inject(MovieService);
  readonly #paginationStateService = inject(PaginationStateService);
  readonly #schedule = inject(ScheduleService);
  menuItems: MenuItem[] = [];
  activeItem: MenuItem | undefined;
  movieList: MovieResponse[] = [];
  pagination: PageEvent = { first: 0, rows: 4, page: 0, pageCount: 0 };
  cinemaId: number = 0;
  tabDate: string = '';
  isInitialized = false;
  visible = false;
  schedule: ScheduleForCinemaResponse[] = [];
  movieName = '';
  cinemaName: string = '';
  ngOnInit() {
    const id = localStorage.getItem("selectedId");
    this.cinemaName = localStorage.getItem("cinemaName") ?? '';
    if (id) {
      this.cinemaId = Number(id);
      const paginationState = this.#paginationStateService.getPaginationState(this.stateKey);
      this.pagination.page = paginationState.page ?? 0;
      this.pagination.rows = paginationState.rows ?? 4;
      this.generate7DayTabs();
      this.tabDate = paginationState.tabId ?? this.menuItems[0].id!;      
      this.activeItem = this.menuItems.find(item => item.id === this.tabDate) ?? this.menuItems[0];
      this.isInitialized = true;
      this.getMoviesByDate();
    }
  }

  generate7DayTabs(): void {
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const isoDate = date.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
    const label = date.toLocaleDateString('vi-VN', {
      weekday: 'short', day: '2-digit', month: '2-digit'
    });
    this.menuItems.push({ label, id: isoDate });
  }
}

  onActiveItemChange(item: MenuItem) {
    if (this.isInitialized) {
      this.isInitialized = false;
      return;
    }
    if (item?.id) {
      this.tabDate = item.id;
      this.pagination.page = 0;
      this.#paginationStateService.setPaginationState(this.stateKey, {
        page: 0,
        rows: this.pagination.rows,
        tabId: this.tabDate
      });
      this.getMoviesByDate();
    }
  }

  onPageChange(event: any) {
    this.pagination.page = event.page;
    this.pagination.rows = event.rows;
    this.#paginationStateService.setPaginationState(this.stateKey, {
      page: this.pagination.page,
      rows: this.pagination.rows,
      tabId: this.tabDate
    });
    this.getMoviesByDate();
  }

  getMoviesByDate() {
    const request: MovieSearchRequest = {
      pageNo: this.pagination.page,
      pageSize: this.pagination.rows,
      sortBy: 'created_date',
      isAscending: false,
      cinemaId: this.cinemaId,
      dateSearch: new Date(this.tabDate),
      name:''
    };
    this.#movie.getMoviesByDate(request).subscribe({
      next: (res: any) => this.handleMovieResponse(res),
      error: (err: any) => this.#toast.error(err)
    });
  }

  private handleMovieResponse(res: any) {
    if (res.status === success) {
      this.movieList = [...res.data.items];
      this.pagination.pageCount = res.data.totalElements;
    } else {
      this.#toast.error(res.message);
    }
  }
  handleBuyTicket(event: { movieId: number; name: string }) {
    console.log();

    this.movieName = event.name;
    this.#schedule.getScheduleForMovieByDate({ movieId: event.movieId, cinemaId: this.cinemaId, date: new Date(this.tabDate) }).subscribe({
      next: (res) => {
        if (res.status === success) {
          this.schedule = [];
          this.schedule.push(res.data);
          this.visible = true;
        }
        else {
          this.#toast.error(res.message)
        }
      },
      error: (err) => this.#toast.error(err)
    });

  }
}

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
