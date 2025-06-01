import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CinemaService } from '../../../services/cinema/cinema.service';
import { ToastService } from '../../../services/toast/toast.service';
import { ScheduleService } from '../../../services/schedule/schedule.service';
import { MovieService } from '../../../services/moive/movie.service';
import { CinemaGetRoomRequest, CinemaResponse } from '../../../models/cinema';
import { RoomResponse } from '../../../models/room';
import { RoomTypeEnum, success } from '../../../utils/constants';
import { ScheduleForRoomResponse } from '../../../models/schedule';
import { NgSelectModule } from '@ng-select/ng-select';
import { RoomService } from '../../../services/room/room.service';
import { forkJoin, map } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { noWhiteSpace } from '../../../utils/validator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-schedule',
  standalone: true,
  providers: [ConfirmationService],
  imports: [
    CommonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    FormsModule,
    TableModule,
    NgSelectModule,
    DialogModule,
    ReactiveFormsModule,
    NgSelectModule,
    ConfirmDialogModule,
    PaginatorModule,
    RouterModule
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {

  readonly #toast = inject(ToastService);
  readonly #cinema = inject(CinemaService);
  readonly #room = inject(RoomService);
  readonly #schedule = inject(ScheduleService);
  readonly #movie = inject(MovieService);
  readonly #confirm = inject(ConfirmationService);
  cinemas: CinemaResponse[] = [];
  rooms: RoomResponse[] = [];
  cinemaId!: number;
  selectedDate: Date = new Date();
  pagination: PageEvent = { first: 0, rows: 5, page: 0, pageCount: 0 };
  roomSchedule: RoomScheduleResponse[] = [];
  movies: MovieScheduleResponse[] = [];
  visible = false;
  submitted = false;
  createForm!: FormGroup;
  disable = false;

  ngOnInit() {
    this.initData();
  }
  constructor(private formBuilder: FormBuilder) { }

  initData() {
    this.#cinema.getAllCinema().subscribe(
      res => {
        if (res.status === success) {
          this.cinemas = res.data;
          this.cinemaId = this.cinemas[0].id;
          this.getRoomSchedule();
        } else {
          this.#toast.error(res.message);
        }
      }
    );
    this.getMovie();
    this.createForm = this.formBuilder.group({
      time: ['', [Validators.required]],
      movieId: ['', [Validators.required]]
    });
  }
  onPageChange(event: any) {
    this.pagination.page = event.page;
    this.pagination.rows = event.rows;
    this.getRoomSchedule();
  }
  getMovie() {
    this.#movie.getMovieSchedule(this.convertToVNTime(this.selectedDate)).subscribe(
      res => {
        if (res.status === success) {
          this.movies = res.data;
        } else {
          this.#toast.error(res.message);
        }
      }
    );
  }

  onDateChange() {
    this.getRoomSchedule();
    this.getMovie();
    if (this.selectedDate < new Date()) {
      this.disable = true;
    } else {
      this.disable = false;
    }
  }

  getRoomSchedule() {
    const request: CinemaGetRoomRequest = {
      pageNo: this.pagination.page,
      pageSize: this.pagination.rows,
      sortBy: 'id',
      isAscending: false,
      cinemaId: this.cinemaId
    };

    this.#cinema.getRoomByCinema(request).subscribe(
      res => {
        if (res.status === success) {
          this.rooms = res.data.items ?? [];

          if (this.rooms.length === 0) {
            this.roomSchedule = [];
            return;
          }
          this.getSchedule(this.rooms);
          this.pagination.page = res.data.pageNo;
          this.pagination.rows = res.data.pageSize;
          this.pagination.pageCount = res.data.totalElements;
          this.pagination.first = res.data.pageNo * res.data.pageSize;
        } else {
          this.#toast.error(res.message);
          this.rooms = [];
          this.roomSchedule = [];
        }
      }
    );
  }

  getSchedule(rooms: RoomResponse[]) {
    const requests = rooms.map(room => {
      const request = {
        date: this.convertToVNTime(this.selectedDate),
        movieId: null,
        roomId: room.id
      };
      return this.#schedule.getScheduleForRoom(request).pipe(
        map(res => {
          if (res.status === success) {
            return { room, schedule: res.data };
          } else {
            this.#toast.error(res.message);
            return { room, schedule: [] };
          }
        })
      );
    });

    forkJoin(requests).subscribe(results => {
      this.roomSchedule = results.sort((a, b) => a.room.id - b.room.id);
    });
  }

  convertToVNTime(date: Date): Date {
    const localDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return localDate;
  }

  dialogHeader = '';
  roomId = -1;
  onCreateSchedule(room: RoomResponse) {
    this.visible = true;
    this.roomId = room.id;
    this.createForm.reset()
    const date = this.selectedDate;
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getFullYear().toString().slice(0)}`;
    this.dialogHeader = `Thêm lịch chiếu: ${room.name} Ngày ${formattedDate}`;
  }
  combineDateAndTime(date: Date, time: Date): Date {
    const result = new Date(date);
    result.setHours(time.getHours() + 7, time.getMinutes(), 0, 0);
    return result;
  }

  onCreate() {
    this.submitted = true;
    if (!this.createForm.valid) {
      return;
    }
    const rq = {
      roomId: this.roomId,
      scheduleTime: this.combineDateAndTime(this.selectedDate, this.createForm.value['time']),
      movieId: this.createForm.value['movieId']
    }

    this.#schedule.createSchedule(rq).subscribe(
      res => {
        if (res.status === success) {
          this.#toast.success("Thêm thành công!");
          this.getRoomSchedule();
          this.visible = false;
        } else {
          this.#toast.error(res.message);

        }
      }
    )

  }

  formatTime(timeString: string): string {
    const date = new Date('1970-01-01T' + timeString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  onCinemaIdChanged(event: any) {
    if (event) {
      this.cinemaId = event.id;
      this.getRoomSchedule();
    }
  }
  confirmDelete(schedule: ScheduleForRoomResponse) {
    console.log(schedule);

    this.#confirm.confirm({
      message: 'Bạn có chắc muốn xóa xuất chiếu  "' + this.formatTime(schedule.startTime.toString()) + '-' + this.formatTime(schedule.endTime.toString()) + '" không ?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.#schedule.deleteSchedule(schedule.id).subscribe(
          res => {
            if (res.status === success) {
              this.#toast.success("Xóa thành công!");
              this.getRoomSchedule();
            } else {
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

export interface RoomScheduleResponse {
  room: RoomResponse;
  schedule: ScheduleForRoomResponse[];
}

export interface MovieScheduleResponse {
  id: number;
  name: string;
}

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
