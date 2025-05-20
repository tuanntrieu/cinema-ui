import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { FoodService } from '../../../services/food/food.service';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from '../../../services/toast/toast.service';
import { FoodRequest, FoodResponse } from '../../../models/combo';
import { noWhiteSpace } from '../../../utils/validator';
import { success } from '../../../utils/constants';

@Component({
  selector: 'app-food',
  standalone: true,
  providers: [ConfirmationService],
  imports: [TableModule, CommonModule,
    PaginatorModule, ButtonModule,
    ConfirmDialogModule, DialogModule,
    FormsModule, ReactiveFormsModule,
    InputTextModule],
  templateUrl: './food.component.html',
  styleUrl: './food.component.scss'
})
export class FoodComponent {
  readonly #food = inject(FoodService);
  readonly #toast = inject(ToastService);
  readonly #confirm = inject(ConfirmationService);
  foods: FoodResponse[] = [];
  paginator: PageEvent = { first: 0, rows: 6, page: 0, pageCount: 0 };
  visibleAdd = false;
  createForm!: FormGroup;
  createSubmitted = false;
  nameSearch = '';
  constructor(private formBuilder: FormBuilder) { }
  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      name: ['', [Validators.required, noWhiteSpace()]],
    });
    this.getFood();

  }
  getFood() {
    const request: FoodRequest = {
      pageNo: this.paginator.page,
      pageSize: this.paginator.rows,
      sortBy: 'id',
      isAscending: false,
      name: this.nameSearch
    }

    this.#food.getAllFoodPage(request).subscribe(
      {
        next: (res) => {
          if (res.status === success) {
            this.foods = res.data.items;
            this.paginator.page = res.data.pageNo;
            this.paginator.rows = res.data.pageSize;
            this.paginator.pageCount = res.data.totalElements;
            this.paginator.first = res.data.pageNo * res.data.pageSize;
          } else {
            this.#toast.error(res.message);
          }
        }
      }
    );

  }
  onPageChange(event: any) {
    this.paginator.page = event.page;
    this.paginator.rows = event.rows;
    this.getFood();
  }

  create() {
    this.createSubmitted = true;
    if (!this.createForm.valid) {
      return;
    }
    this.#food.createFood(this.createForm.value['name']).subscribe(
      (res) => {
        if (res.status === success) {
          this.#toast.success("Thêm thành công !");
          this.visibleAdd = false;
          this.getFood();
        } else {
          this.#toast.error(res.message);
        }
      }
    );
  }
  onSearchChange() {
    this.getFood()
  }
  confirmDelete(item: FoodResponse) {
    this.#confirm.confirm({
      message: 'Bạn có chắc muốn xóa "' + item.name + '" không ?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.#food.deleteFood(item.id).subscribe(
          (res) => {
            if (res.status === success) {
              this.#toast.success("Xóa thành công!");
              this.getFood();
            }
            else {
              this.#toast.error(res.message);
            }
          }
        );
      },
      reject: () => {
      }
    });
  }
  onAddClick() {
    this.createSubmitted = false;
    this.visibleAdd = true;
    this.createForm.patchValue({
      name: ''
    });
  }
}
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}