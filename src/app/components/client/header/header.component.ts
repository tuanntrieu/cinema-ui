import { Component, inject, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ImageModule } from 'primeng/image';
import { MenuItem } from 'primeng/api';
import { CinemaService } from '../../../services/cinema/cinema.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../../services/toast/toast.service';
import { jwtDecode } from 'jwt-decode';
import { CustomerService } from '../../../services/customer/customer.service';
import { Customer } from '../../../models/customer';
import { MenuModule } from 'primeng/menu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TieredMenuModule, MenubarModule,
    MenuModule, ImageModule, NgSelectModule,
    CommonModule, FormsModule, DialogModule,
    ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  items: MenuItem[] = [
    { label: 'PHIM', routerLink: '/movies' },
    { label: 'LỊCH CHIẾU THEO RẠP', routerLink: '/showtimes' }

  ];
  visible = false;
  selectedId: number | undefined;
  readonly #cinema = inject(CinemaService);
  readonly #auth = inject(AuthService);
  readonly #toast = inject(ToastService);
  readonly #customer = inject(CustomerService);
  readonly #router = inject(Router)
  cinemas: CinemaResponse[] = [];
  cinemasByPro: CinemaResponse[] = [];
  provinces: string[] = [];
  proSelected: string | undefined;
  user: Customer | null = null;

  ngOnInit() {

    const username = this.#customer.getCurrentUser();
    if (username) {
      this.#customer.getCustomerInfor(username).subscribe(
        {
          next: (customerRes) => {
            this.#customer.setCurrentUser(customerRes.data);
          },
          error: (err) => {
            this.#toast.error(err);
          }
        }
      )
    }
    this.#customer.currentUser$.subscribe(user => {
      this.user = user;
      if (this.user) {
        if (this.user.cinemaPicked) {
          localStorage.setItem("selectedId", this.user.cinemaPicked.toString());
          this.selectedId = this.user.cinemaPicked;
        } else {
          localStorage.removeItem("selectedId");
          this.loadSelectedCinema();
        }
      } else {
        this.loadSelectedCinema();
      }
    });
    this.loadCinemas();
    this.loadProvinces();
    this.buildMenu()
  }

  private loadCinemas() {
    this.#cinema.getAllCinema().subscribe({
      next: (res) => {
        this.cinemas = res.data;
        if (this.selectedId) {
          const name = this.cinemas.find((cinema) => {
            cinema.id === this.selectedId;
          })?.name;
          if (name)
            localStorage.setItem("cinemaName", name)
        }
      },
      error: (err) => {
        this.#toast.error('Lỗi', err.toString());
      }
    });
  }

  private loadProvinces() {
    this.#cinema.getAllProvince().subscribe({
      next: (res) => {
        this.provinces = res.data;
      },
      error: (err) => {
        this.#toast.error('Lỗi', err.toString());
      }
    });
  }

  private loadSelectedCinema() {
    const storeId = localStorage.getItem("selectedId");
    if (storeId) {
      this.selectedId = Number(storeId);
    } else {
      this.visible = true;
    }
  }

  onCinemaIdChanged(cinema: CinemaResponse) {
    if (cinema) {
      this.selectedId = cinema.id;
      localStorage.setItem("selectedId", this.selectedId.toString());
      localStorage.setItem("cinemaName", cinema.name);
      this.saveCineme(cinema.id);
      window.location.href = '/'
    } else {
      this.selectedId = undefined;
    }
  }
  onProvinceSelect(province: string) {
    this.#cinema.getCinemaByProvince(province).subscribe({
      next: (res) => {
        this.cinemasByPro = res.data;
      },
      error: (err) => {
        this.#toast.error('Lỗi', err.toString());
      }
    });
  }

  onCinemaSelectd(cinema: CinemaResponse) {
    if (cinema) {
      this.selectedId = cinema.id;
      localStorage.setItem("selectedId", this.selectedId.toString());
      localStorage.setItem("cinemaName", cinema.name);
      window.location.href = '/'
      this.saveCineme(cinema.id);
      this.visible = false;
    } else {
      this.selectedId = undefined;
    }
  }

  onDialogClose() {
    if (!this.selectedId && this.cinemas.length > 0) {

      localStorage.setItem("selectedId", this.cinemas[0].id.toString())
      localStorage.setItem("cinemaName", this.cinemas[0].name);
      this.selectedId = this.cinemas[0].id;
      window.location.href = '/'
    }
  }
  menuItems: MenuItem[] = [];
  buildMenu() {
    this.menuItems = [
      {
        label: 'Thông tin cá nhân',
        icon: 'pi pi-user',
        routerLink: '/update-infor'
      },
      {
        label: 'Đổi mật khẩu',
        icon: 'pi pi-lock',
        routerLink: '/change-password'
      },
      {
        label: 'Lịch sử đặt vé',
        icon: 'pi pi-calendar',
        routerLink: '/order-history'

      },
      {
        label: 'Đăng xuất',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  logout() {
    this.#auth.logout().subscribe(
      (res) => {
        this.#toast.success(res.data.message)
      }
    );
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    location.reload();
  }
  extractUsername(): string {
    const token = localStorage.getItem("access_token");
    if (token) {
      const tokenDecode = jwtDecode(token) as { sub: string };
      if (tokenDecode.sub) {
        return tokenDecode.sub;
      }
    }
    return "";
  }
  saveCineme(cinemaId: number) {
    if (this.user) {
      this.#customer.updateCustomerCinema(this.extractUsername(), cinemaId).subscribe(
        {
          next: (res) => {
          },
          error: (err) => {
            this.#toast.error(err);
          }
        }
      );
    }
  }
}

export interface CinemaResponse {
  id: number;
  name: string;
  province: string;
}

