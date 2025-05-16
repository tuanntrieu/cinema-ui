import { ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';
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
import { PaginationStateService } from '../../../services/pagination/pagination-state.service';
import { ScheduleForCinemaResponse } from '../../../models/schedule';
import { ScheduleService } from '../../../services/schedule/schedule.service';
import { DialogModule } from 'primeng/dialog';
import { ScheduleCardComponent } from '../../../components/client/schedule-card/schedule-card.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TabMenuModule, PaginatorModule,
    MoiveCardComponent, DialogModule,
    ScheduleCardComponent, NgxSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly #toast = inject(ToastService);
  readonly #router = inject(Router);
  readonly #movie = inject(MovieService);
  readonly #paginationStateService = inject(PaginationStateService);
  readonly #schedule = inject(ScheduleService);
  readonly stateKey = "home";
  menuItems: MenuItem[] = [];
  activeItem: MenuItem | undefined;
  movieList: MovieResponse[] = [];
  pagination: PageEvent = { first: 0, rows: 2, page: 0, pageCount: 0 };
  cinemaId: number = 0;
  dateSearch!: Date;
  tab!: string;
  isInitialized = false;
  isComing = false;
  schedule: ScheduleForCinemaResponse[] = [];
  visible: boolean = false;
  movieName: string = '';
  cinemaName: string = '';
  ngOnInit() {

    const id = localStorage.getItem("selectedId");
    this.cinemaName = localStorage.getItem("cinemaName") ?? '';
    if (id) {
      this.cinemaId = Number(id);
      const paginationState = this.#paginationStateService.getPaginationState(this.stateKey);
      this.pagination.page = paginationState.page;
      this.pagination.rows = paginationState.rows;
      this.isInitialized = true;
      this.initMenu();
      this.tab === 'coming' ? this.getMoviesComingSoon() : this.getMoviesByDate();
    }
  }
  private initMenu() {
    this.menuItems = [
      { label: 'PHIM ĐANG CHIẾU', id: 'now' },
      { label: 'PHIM SẮP CHIẾU', id: 'coming' }
    ];
    const paginationState = this.#paginationStateService.getPaginationState(this.stateKey);
    this.tab = paginationState.tabId ?? 'now';
    this.activeItem = this.menuItems.find(item => item.id === this.tab);
    if (!this.activeItem) {
      this.activeItem = this.menuItems[0];
    }
  }

  onActiveItemChange(item: MenuItem) {
    if (this.isInitialized) {
      this.isInitialized = false;
      return;
    }
    if (item) {
      this.tab = item.id === 'coming' ? 'coming' : 'now';
      this.pagination.page = 0;
      this.#paginationStateService.setPaginationState(this.stateKey, {
        page: 0,
        rows: this.pagination.rows,
        tabId: this.tab
      });
      this.tab === 'coming' ? this.getMoviesComingSoon() : this.getMoviesByDate();
    }
  }

  onPageChange(event: any) {
    this.pagination.page = event.page;
    this.pagination.rows = event.rows;
    this.#paginationStateService.setPaginationState(this.stateKey, {
      page: this.pagination.page,
      rows: this.pagination.rows
    });
    this.tab === 'coming' ? this.getMoviesComingSoon() : this.getMoviesByDate();
  }

  getMoviesByDate() {
    this.isComing = false;
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
        this.handleMovieResponse(res);
      },
      error: (err: any) => {
        this.#toast.error(err);
      }
    });
  }

  getMoviesComingSoon() {
    this.isComing = true;
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
      this.pagination.page = res.data.pageNo;
      this.pagination.rows = res.data.pageSize;
      this.pagination.pageCount = res.data.totalElements;
      this.pagination.first = this.pagination.page * this.pagination.rows;
      res.data.items.forEach((movie: any) => {
        this.movieList.push({ ...movie });
      });
    } else {
      this.#toast.error(res.message);
    }
  }
  handleBuyTicket(event: { movieId: number; name: string }) {

    this.movieName = event.name;
    this.#schedule.getScheduleForMovieByCinema({ movieId: event.movieId, cinemaId: this.cinemaId }).subscribe({
      next: (res) => {
        if (res.status === success) {
          this.schedule = res.data;
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
