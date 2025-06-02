import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { StatisticsService } from '../../../services/statistics/statistics.service';
import { ToastService } from '../../../services/toast/toast.service';
import { success } from '../../../utils/constants';
import { CinemaService } from '../../../services/cinema/cinema.service';
import { CalendarModule } from 'primeng/calendar';
import { CinemaResponse } from '../../../components/client/header/header.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RevenueChartRequest, RevenueChartResponse, RevenueCinemaRequest, RevenueCinemaResponse, RevenueMovieRequest, RevenueMovieResponse } from '../../../models/statistics';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DropdownModule, CommonModule, FormsModule,
    CalendarModule, NgSelectModule, ChartModule, ButtonModule,
    TableModule, PaginatorModule, InputTextModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  readonly #statistics = inject(StatisticsService);
  readonly #toast = inject(ToastService);
  readonly #cinema = inject(CinemaService);
  cinemas: CinemaResponse[] = [];
  countCustomer = 0;
  rateCustomer = 0
  countTicket = 0;
  rateTicket = 0;
  sumTotal = 0;
  rateTotal = 0;
  documentStyle = getComputedStyle(document.documentElement);
  textColor = this.documentStyle.getPropertyValue('--text-color');
  textColorSecondary = this.documentStyle.getPropertyValue('--text-color-secondary');
  surfaceBorder = this.documentStyle.getPropertyValue('--surface-border');
  data = {
    labels: [''],
    datasets: [
      {
        label: 'Doanh thu',
        fill: false,
        borderColor: this.documentStyle.getPropertyValue('--blue-500'),
        yAxisID: 'y',
        tension: 0.4,
        data: [0]
      },
      {
        label: 'Số vé',
        fill: false,
        borderColor: this.documentStyle.getPropertyValue('--green-500'),
        yAxisID: 'y1',
        tension: 0.4,
        data: [0]
      }
    ]
  };

  options = {
    stacked: false,
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: this.textColor
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: this.textColorSecondary
        },
        grid: {
          color: this.surfaceBorder
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          color: this.textColorSecondary
        },
        grid: {
          color: this.surfaceBorder
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: {
          color: this.textColorSecondary,
          stepSize: 1,
          beginAtZero: true,
          callback: function (value: number) {
            return Number.isInteger(value) ? value : '';
          }
        },
        grid: {
          drawOnChartArea: false,
          color: this.surfaceBorder
        }
      }
    }
  };
  dataSchedule = {
    labels: [
      "00:00 - 02:00",
      "02:00 - 04:00",
      "04:00 - 06:00",
      "06:00 - 08:00",
      "08:00 - 10:00",
      "10:00 - 12:00",
      "12:00 - 14:00",
      "14:00 - 16:00",
      "16:00 - 18:00",
      "18:00 - 20:00",
      "20:00 - 22:00",
      "22:00 - 00:00"
    ],

    datasets: [
      {
        label: 'Số ghế bán được ',
        backgroundColor: this.documentStyle.getPropertyValue('--blue-500'),
        borderColor: this.documentStyle.getPropertyValue('--blue-500'),
        data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55]
      }
    ]
  };
  optionsSchedule = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: this.textColor
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: this.textColorSecondary,
          font: {
            weight: 500
          }
        },
        grid: {
          color: this.surfaceBorder,
          drawBorder: false
        }
      },
      y: {
        ticks: {
          color: this.textColorSecondary
        },
        grid: {
          color: this.surfaceBorder,
          drawBorder: false
        }
      }

    }
  };


  timeOptions = [
    { label: 'Hôm nay', value: 'today' },
    { label: 'Tuần này', value: 'thisWeek' },
    { label: 'Tháng này', value: 'thisMonth' }
  ];
  selectedTime: string = 'today';
  typeOptions = [
    { label: 'Theo năm', value: 'year' },
    { label: 'Theo tháng', value: 'month' }
  ];
  selectedCinema: number | null = null;
  selectedType = this.typeOptions[0];
  selectedDate: Date = new Date();
  selectedMonth: Date = new Date();
  calendarView: 'month' | 'year' | 'date' = 'year';
  calendarFormat = 'yy';

  ngOnInit(): void {
    this.getCardRevenue(this.selectedTime);
    this.#cinema.getAllCinema().subscribe(
      (res) => {
        if (res.status === success) {
          this.cinemas = res.data;
        }
        else {
          this.#toast.error(res.message)
        }
      }
    );
    this.getRevenueChart(this.selectedType.value);
    this.getScheduleChart();
    this.getMovieTable();
    this.getCinemaTable();
  }
  onSelectTypeChange() {
    if (this.selectedType.value === 'year') {
      this.calendarView = 'year';
      this.calendarFormat = 'yy';
    } else {
      this.calendarView = 'month';
      this.calendarFormat = 'mm/yy';
    }
    this.selectedDate = new Date()
    this.getRevenueChart(this.selectedType.value);
  }

  onDropDownChange(event: any) {
    this.selectedTime = event.value;
    this.getCardRevenue(this.selectedTime);
  }

  onCinemaIdChanged(cinema: CinemaResponse) {
    if (cinema) {
      this.selectedCinema = cinema.id;
      this.getRevenueChart(this.selectedType.value);
    }
  }
  onCinemaCleared() {
    this.selectedCinema = null;
    this.getRevenueChart(this.selectedType.value);
  }
  onDateChange(event: any) {
    if (this.selectedType.value == 'year') {
      const correctedDate = new Date(event.getFullYear(), event.getMonth() + 1, event.getDate());
      this.selectedDate = correctedDate;
    }
    else {
      const correctedDate = new Date(event.getFullYear(), event.getMonth(), event.getDate() + 1);
      this.selectedDate = correctedDate;
    }
    this.getRevenueChart(this.selectedType.value);
  }
  displayDate: Date = new Date();
  onMonthChange(event: any) {
    const correctedDate = new Date(event.getFullYear(), event.getMonth() + 1, event.getDate());
    this.selectedMonth = correctedDate;
    this.displayDate = event;
    this.getScheduleChart();
  }

  getRevenueChart(type: string) {
    const request: RevenueChartRequest = {
      cinemaId: this.selectedCinema,
      date: this.selectedDate,
      ...(this.selectedCinema !== null ? { cinemaId: this.selectedCinema } : {})
    };
    switch (type) {
      case 'year':
        this.#statistics.getRevenueChartByYear(request).subscribe(
          (res) => {
            if (res.status === success) {
              this.generateChart(res.data);
            }
            else {
              this.#toast.error(res.message)
            }
          }
        );
        break;
      case 'month':
        this.#statistics.getRevenueChartByMonth(request).subscribe(
          (res) => {
            if (res.status === success) {
              this.generateChart(res.data);
            }
            else {
              this.#toast.error(res.message)
            }
          }
        );
        break;
    }
  }
  getScheduleChart() {
    this.#statistics.getStatisticsSchedule(this.selectedMonth).subscribe(
      (res) => {
        if (res.status === success) {
          this.generateSchdeduleChart(res.data);
        }
        else {
          this.#toast.error(res.message)
        }
      }
    );
  }
  scheduleChart: StatisticsScheduleResponse[] = [];
  generateSchdeduleChart(scheduleChart: StatisticsScheduleResponse[]) {
    this.dataSchedule = {
      labels: scheduleChart.map(item => item.label),
      datasets: [
        {
          label: 'Số ghế bán được ',
          backgroundColor: this.documentStyle.getPropertyValue('--blue-500'),
          borderColor: this.documentStyle.getPropertyValue('--blue-500'),
          data: scheduleChart.map(item => Number(item.countSeats))
        }
      ]
    };
  }
  generateChart(dataChart: RevenueChartResponse[]) {
    this.data = {
      labels: dataChart.map(item => item.label),
      datasets: [
        {
          label: 'Doanh thu',
          fill: false,
          borderColor: this.documentStyle.getPropertyValue('--blue-500'),
          yAxisID: 'y',
          tension: 0.4,
          data: dataChart.map(item => Number(item.total))
        },
        {
          label: 'Số vé',
          fill: false,
          borderColor: this.documentStyle.getPropertyValue('--green-500'),
          yAxisID: 'y1',
          tension: 0.4,
          data: dataChart.map(item => Number(item.countTickets))
        }
      ]
    };
  }

  getCardRevenue(selected: string) {
    switch (selected) {
      case 'today':
        this.getRevenueByDate();
        break;
      case 'thisWeek':
        this.getRevenueByWeek();
        break;
      case 'thisMonth':
        this.getRevenueByMonth();
        break;
    }
  }
  getRevenueByDate() {
    this.#statistics.countCustomerByDate(new Date()).subscribe({
      next: (res) => {
        if (res.status === success) {
          this.countCustomer = res.data.total;
          this.rateCustomer = res.data.rate;
        }
        else {
          this.#toast.error(res.message)
        }
      }
    });
    this.#statistics.countTicketByDate(new Date()).subscribe({
      next: (res) => {
        if (res.status === success) {
          this.countTicket = res.data.total;
          this.rateTicket = res.data.rate;
        }
        else {
          this.#toast.error(res.message)
        }
      }
    });
    this.#statistics.sumTotalByDate(new Date()).subscribe({
      next: (res) => {
        if (res.status === success) {
          this.sumTotal = res.data.total;
          this.rateTotal = res.data.rate;
        }
        else {
          this.#toast.error(res.message)
        }
      }
    });
  }
  getRevenueByWeek() {
    this.#statistics.countCustomerByWeek(new Date()).subscribe({
      next: (res) => {
        if (res.status === success) {
          this.countCustomer = res.data.total;
          this.rateCustomer = res.data.rate;
        }
        else {
          this.#toast.error(res.message)
        }
      }
    });
    this.#statistics.countTicketByWeek(new Date()).subscribe({
      next: (res) => {
        if (res.status === success) {
          this.countTicket = res.data.total;
          this.rateTicket = res.data.rate;
        }
        else {
          this.#toast.error(res.message)
        }
      }
    });
    this.#statistics.sumTotalByWeek(new Date()).subscribe({
      next: (res) => {
        if (res.status === success) {
          this.sumTotal = res.data.total;
          this.rateTotal = res.data.rate;
        }
        else {
          this.#toast.error(res.message)
        }
      }
    });
  }
  getRevenueByMonth() {
    this.#statistics.countCustomerByMonth(new Date()).subscribe({
      next: (res) => {
        if (res.status === success) {
          this.countCustomer = res.data.total;
          this.rateCustomer = res.data.rate;
        }
        else {
          this.#toast.error(res.message)
        }
      }
    });
    this.#statistics.countTicketByMonth(new Date()).subscribe({
      next: (res) => {
        if (res.status === success) {
          this.countTicket = res.data.total;
          this.rateTicket = res.data.rate;
        }
        else {
          this.#toast.error(res.message)
        }
      }
    });
    this.#statistics.sumTotalByMonth(new Date()).subscribe({
      next: (res) => {
        if (res.status === success) {
          this.sumTotal = res.data.total;
          this.rateTotal = res.data.rate;
        }
        else {
          this.#toast.error(res.message)
        }
      }
    });
  }

  pageMovie: PageEvent = { first: 0, rows: 5, page: 0, pageCount: 0 };
  pageCinema: PageEvent = { first: 0, rows: 5, page: 0, pageCount: 0 };
  movie: RevenueMovieResponse[] = [];
  cinema: RevenueCinemaResponse[] = [];
  sortMovie = false;
  sortCinema = false;
  onSortMovie() {
    this.sortMovie = !this.sortMovie;
    this.getMovieTable();
  }
  onSortCinema() {
    this.sortCinema = !this.sortCinema;
    this.getCinemaTable();
  }
  onPageMovieChange(event: any) {
    this.pageMovie.page = event.page;
    this.pageMovie.rows = event.rows;
    this.getMovieTable();
  }
  onPageCinemaChange(event: any) {
    this.pageCinema.page = event.page;
    this.pageCinema.rows = event.rows;
    this.getCinemaTable();
  }
  exportCinemaRevenueToExcel() {
    const request: RevenueCinemaRequest = {
      pageNo: 0,
      pageSize: 0,
      sortBy: '',
      isAscending: this.sortCinema,
      date: this.selectedMonthCinema
    }
    this.#statistics.exportCinemaExcel(request).subscribe(
      (response: HttpResponse<Blob>) => {
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition?.substring(contentDisposition.indexOf("filename=") + 9) || 'cinema.xlsx';
        if (response.body) {
          const blob = new Blob([response.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const fileUrl = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = filename;
          link.click();
          this.#toast.success("Tải xuống thành công");
          URL.revokeObjectURL(fileUrl);
        } else {
          this.#toast.error("Không có dữ liệu để tải xuống.", "Error");
        }
      },
      (error) => {
        if (error.error && error.error.message) {
          this.#toast.error(error.error.message, "Error");
        } else {
          this.#toast.error("Đã xảy ra lỗi trong quá trình xuất tệp.", "Error");
        }
      }
    );
  }
  exportMovieRevenueToExcel() {
    const request: RevenueMovieRequest = {
      pageNo: 0,
      pageSize: 0,
      sortBy: '',
      isAscending: this.sortMovie,
      date: this.selectedMonthMovie,
      name: this.movieSearchKeyword
    }
    this.#statistics.exportMovieExcel(request).subscribe(
      (response: HttpResponse<Blob>) => {
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition?.substring(contentDisposition.indexOf("filename=") + 9) || 'movie.xlsx';
        if (response.body) {
          const blob = new Blob([response.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const fileUrl = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = filename;
          link.click();
          this.#toast.success("Tải xuống thành công");
          URL.revokeObjectURL(fileUrl);
        } else {
          this.#toast.error("Không có dữ liệu để tải xuống.", "Error");
        }
      },
      (error) => {
        if (error.error && error.error.message) {
          this.#toast.error(error.error.message, "Error");
        } else {
          this.#toast.error("Đã xảy ra lỗi trong quá trình xuất tệp.", "Error");
        }
      }
    );

  }
  getMovieTable() {
    const request: RevenueMovieRequest = {
      pageNo: this.pageMovie.page,
      pageSize: this.pageMovie.rows,
      sortBy: '',
      isAscending: this.sortMovie,
      date: this.selectedMonthMovie,
      name: this.movieSearchKeyword
    }
    this.#statistics.getRevenueMovie(request).subscribe({
      next: (res) => {
        if (res.status === success) {
          this.movie = res.data.items;
          this.pageMovie.page = res.data.pageNo;
          this.pageMovie.rows = res.data.pageSize;
          this.pageMovie.pageCount = res.data.totalElements;
          this.pageMovie.first = res.data.pageNo * res.data.pageSize;
        }
        else {
          this.#toast.error(res.message)
        }
      }
    });
  }

  getCinemaTable() {
    const request: RevenueCinemaRequest = {
      pageNo: this.pageCinema.page,
      pageSize: this.pageCinema.rows,
      sortBy: '',
      isAscending: this.sortCinema,
      date: this.selectedMonthCinema
    }
    this.#statistics.getRevenueCinema(request).subscribe({
      next: (res) => {
        if (res.status === success) {
          this.cinema = res.data.items;
          this.pageCinema.page = res.data.pageNo;
          this.pageCinema.rows = res.data.pageSize;
          this.pageCinema.pageCount = res.data.totalElements;
          this.pageCinema.first = res.data.pageNo * res.data.pageSize;
        }
        else {
          this.#toast.error(res.message)
        }
      }
    });
  }
  selectedMonthMovie: Date | null = null;
  selectedMonthCinema: Date | null = null;
  movieSearchKeyword: string | null = '';

  onMonthMovieSelect(event: any) {
    const correctedDate = new Date(event.getFullYear(), event.getMonth(), event.getDate() + 1);
    this.selectedMonthMovie = correctedDate;
    this.getMovieTable();
  }

  onMonthCinemaSelect(event: any) {
    const correctedDate = new Date(event.getFullYear(), event.getMonth(), event.getDate() + 1);
    this.selectedMonthCinema = correctedDate;
    this.getCinemaTable();
  }

  onSearchMovieChange() {
    console.log(this.movieSearchKeyword);

    this.getMovieTable()
  }

}

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
interface StatisticsScheduleResponse {
  label: string;
  countSeats: number;
}