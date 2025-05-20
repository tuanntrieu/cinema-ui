import { Component, inject, OnInit } from '@angular/core';
import { LayoutService } from '../../../services/layout/layout.service';
import { CommonModule } from '@angular/common';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MenuItemComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

  model: any[] = [];
  readonly #auth = inject(AuthService);
  readonly #toast = inject(ToastService);
  readonly #router = inject(Router)

  constructor(public layoutService: LayoutService) { }

  ngOnInit() {
    this.model = [
      {
        label: 'Danh mục',
        icon: 'pi pi-fw pi-briefcase',
        routerLink: ['/admin'],
        items: [
          {
            label: 'Trang chủ',
            icon: 'pi pi-fw pi-home',
            routerLink: '/admin'
          },
          {
            label: 'Thể loại',
            icon: 'pi pi-file-edit',
            routerLink: '/admin/movie-type'
          },
          {
            label: 'Rạp',
            icon: 'pi pi-fw pi-desktop',

          },
          {
            label: 'Phim',
            icon: 'pi pi-fw pi-video',

          },
          {
            label: 'Lịch chiếu ',
            icon: 'pi pi-fw pi-calendar',

          },
          {
            label: 'Giá vé ',
            icon: 'pi pi-fw pi-ticket'

          },
          {
            label: 'Đồ ăn ',
            icon: 'pi pi-fw pi-apple',
            routerLink: '/admin/food'
          }
          ,
          {
            label: 'Combo ',
            icon: 'pi pi-fw pi-turkish-lira'
          }
        ]
      },
      {
        label: 'Cá nhân',
        items: [
          {
            label: 'Cài đặt',
            icon: 'pi pi-fw pi-cog',
            items: [
              // {
              //   label: 'Đổi mật khẩu',
              //   icon: 'pi pi-fw pi-lock',
              //   routerLink: ['change-password']
              // },
              {
                label: 'Đăng xuất',
                icon: 'pi pi-fw pi-power-off',
                command: () => this.logout()
              },

            ]
          }
        ],
      },
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
    this.#router.navigate(['/admin/login'])
  }
}



