import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../../../services/layout/layout.service';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CustomerService } from '../../../services/customer/customer.service';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MenubarModule, CommonModule, ButtonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {

  items: MenuItem[] = [];
  constructor(public layoutService: LayoutService) { }
  readonly #auth = inject(AuthService);
  readonly #toast = inject(ToastService);
  readonly #router = inject(Router)


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


