import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { MovieService } from '../../../services/moive/movie.service';
import { ToastService } from '../../../services/toast/toast.service';
import { ScheduleService } from '../../../services/schedule/schedule.service';

import { MovieDetailResponse } from '../../../models/movie';
import { ScheduleForCinemaResponse } from '../../../models/schedule';
import { success } from '../../../utils/constants';
import { ScheduleCardComponent } from '../../../components/client/schedule-card/schedule-card.component';
import { createSafeTrailerUrl } from '../../../utils/safe-url';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbModule,
    TabMenuModule,
    ScheduleCardComponent
  ],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.scss'
})
export class MovieDetailComponent implements OnInit {
  readonly #toast = inject(ToastService);
  readonly #movie = inject(MovieService);
  readonly #schedule = inject(ScheduleService);

  movie!: MovieDetailResponse;
  breadcrumbItems: MenuItem[] = [];
  homeItem: MenuItem = { label: 'Trang chủ', routerLink: ['/'] };
  type!: string;
  cinemaId!: number;
  schedule: ScheduleForCinemaResponse[] = [];

  safeTrailerUrl!: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute, private sanitizer: DomSanitizer

  ) { }

  ngOnInit(): void {
    const movieId = +this.route.snapshot.paramMap.get('id')!;
    const selectedId = localStorage.getItem("selectedId");
    if (selectedId) this.cinemaId = +selectedId;

    this.#movie.getMovieDetail(movieId).subscribe({
      next: (res) => {
        if (res.status === success) {
          this.movie = res.data;
          this.type = this.movie.types.map(t => t.name).join(', ');
          this.breadcrumbItems = [{ label: this.movie.name }];
          this.safeTrailerUrl = createSafeTrailerUrl(this.movie.trailer, this.sanitizer)!;
        } else {
          this.#toast.error(res.message);
        }
      },
      error: (err) => this.#toast.error(err)
    });

    this.#schedule.getScheduleForMovieByCinema({ movieId, cinemaId: this.cinemaId }).subscribe({
      next: (res) => {
        this.schedule = res.data;
      },
      error: (err) => this.#toast.error(err)
    });
  }

  getYoutubeVideoId(url: string): string | null {
    const regex = /(?:youtube\.com\/.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }



  readonly getLabel = (date: Date): string => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    });
  };
}
