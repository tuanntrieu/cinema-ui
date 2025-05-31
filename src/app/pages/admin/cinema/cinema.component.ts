import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { CinemaService } from '../../../services/cinema/cinema.service';

import { ToastService } from '../../../services/toast/toast.service';
import { CinemaResponse, CinemaSearchRequest } from '../../../models/cinema';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { isPhoneNumber, noWhiteSpace } from '../../../utils/validator';
import { AddressService } from '../../../services/address/address.service';
import { District, Province, Ward } from '../../../models/location';
import { HttpClient } from '@angular/common/http';
import { success } from '../../../utils/constants';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cinema',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule,
    InputTextModule, PaginatorModule,
    DialogModule, FormsModule, ReactiveFormsModule,
    NgSelectModule, RouterModule],
  templateUrl: './cinema.component.html',
  styleUrl: './cinema.component.scss'
})
export class CinemaComponent {
  readonly #toast = inject(ToastService);
  readonly #cinema = inject(CinemaService);
  readonly #address = inject(AddressService);
  pagination: PageEvent = { first: 0, rows: 5, page: 0, pageCount: 0 };
  cinemas: CinemaResponse[] = [];
  nameSearch = '';
  visible = false;
  createForm!: FormGroup;
  provinces: Province[] = [];
  districts: District[] = [];
  wards: Ward[] = [];
  submitted = false;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }
  ngOnInit() {
    this.getCinemas();
    this.createForm = this.formBuilder.group({
      cinemaName: ['', [Validators.required, noWhiteSpace()]],
      hotline: ['', [Validators.required, noWhiteSpace()], [isPhoneNumber()]],
      province: ['', [Validators.required, noWhiteSpace()]],
      district: ['', [Validators.required, noWhiteSpace()]],
      ward: ['', [Validators.required, noWhiteSpace()]],
      detailAddress: ['', [Validators.required, noWhiteSpace()]],
    });
    this.#address.getProvinces().subscribe(
      res => {
        this.provinces = res;
      }
    )
  }

  onSearchChange() {
    this.getCinemas();
  }
  getCinemas() {
    const request: CinemaSearchRequest = {
      pageNo: this.pagination.page,
      pageSize: this.pagination.rows,
      sortBy: 'id',
      isAscending: false,
      name: this.nameSearch
    };
    this.#cinema.getAllCinemaPage(request).subscribe({
      next: (res: any) => {
        this.cinemas = res.data.items;
        this.pagination.page = res.data.pageNo;
        this.pagination.rows = res.data.pageSize;
        this.pagination.pageCount = res.data.totalElements;
        this.pagination.first = res.data.pageNo * res.data.pageSize;
      },
      error: (err: any) => {
        this.#toast.error(err);
      }
    });
  }
  onCreateCinema() {
    this.submitted = true;
    if (!this.createForm.valid) return;
    this.#cinema.createCinema({ ...this.createForm.value }).subscribe(
      res => {
        if (res.status === success) {
          this.#toast.success("Thêm thành công!")
          this.visible = false;
          this.getCinemas();
        }
        else {
          this.#toast.error(res.message);
        }
      }
    );
  }
  openCreateDialog() {
    this.visible = true;
  }
  onProvinceSelect(event: any) {
    if (event) {
      const province = this.provinces.find(p => p.name === event);
      if (province)
        this.#address.getDistricts(province.code).subscribe(
          res => {
            this.districts = res;
            this.createForm.patchValue(
              {
                district: '',
                ward: ''
              }
            );
          }
        )
    }
  }
  onDistrictSelect(event: any) {
    if (event) {
      const district = this.districts.find(p => p.name === event);
      if (district)
        this.#address.getWards(district.code).subscribe(
          res => {
            this.wards = res;
            this.createForm.patchValue(
              {
                ward: ''
              }
            );
          }
        )
    }
  }
  onPageChange(event: any) {
    this.pagination.page = event.page;
    this.pagination.rows = event.rows;
    this.getCinemas();
  }

}
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
