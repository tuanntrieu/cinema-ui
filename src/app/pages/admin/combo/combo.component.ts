import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ComboService } from '../../../services/combo/combo.service';

import { ComboRequest, ComboResponse, ComboSearchRequest, FoodResponse } from '../../../models/combo';
import { ToastService } from '../../../services/toast/toast.service';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { FoodService } from '../../../services/food/food.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { success } from '../../../utils/constants';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-combo',
  standalone: true,
  providers: [ConfirmationService],
  imports: [CommonModule, TableModule, ButtonModule,
    InputTextModule, PaginatorModule, DialogModule, InputNumberModule
    , FileUploadModule, NgSelectModule, ReactiveFormsModule, ConfirmDialogModule],
  templateUrl: './combo.component.html',
  styleUrl: './combo.component.scss'
})
export class ComboComponent {
  readonly #combo = inject(ComboService);
  readonly #toast = inject(ToastService);
  readonly #food = inject(FoodService);
  readonly #confirm = inject(ConfirmationService);
  pagination: PageEvent = { first: 0, rows: 5, page: 0, pageCount: 0 };
  combos: ComboResponse[] = [];
  foods: FoodResponse[] = [];
  nameSearch = '';
  visibleAdd = false;
  inputImage: any;
  inforSelectedFile = "";
  pathImage: string = "";
  imageFile!: File;
  createForm!: FormGroup;
  comboRequest: ComboRequest = {
    name: '',
    price: 0,
    comboDetails: []
  };

  ngOnInit() {
    this.getCombos();
    this.getFood();
  }
  onPageChange(event: any) {
    this.pagination.page = event.page;
    this.pagination.rows = event.rows;
    this.getCombos();
  }
  getFood() {
    this.#food.getAllFood().subscribe(
      res => {
        if (res.status === success) {
          this.foods = res.data;
        } else {
          this.#toast.error(res.message);
        }
      }
    );
  }
  getCombos() {
    const request: ComboSearchRequest = {
      pageNo: this.pagination.page,
      pageSize: this.pagination.rows,
      sortBy: 'id',
      isAscending: false,
      name: this.nameSearch
    };
    this.#combo.getCombo(request).subscribe(
      res => {
        if (res.status === success) {
          this.combos = res.data.items;
          this.pagination.page = res.data.pageNo;
          this.pagination.rows = res.data.pageSize;
          this.pagination.pageCount = res.data.totalElements;
          this.pagination.first = res.data.pageNo * res.data.pageSize;
        } else {
          this.#toast.error(res.message);
        }
      })
  }

  error: string | null | undefined;

  imagePreview: string | ArrayBuffer | null = null;
  @ViewChild('fileUploader') fileUploader: any;
  clearImage() {
    this.imagePreview = null;
    if (this.fileUploader) {
      this.fileUploader.clear();
    }
  }
  onSelect(event: any): void {
    this.imageFile = event.files[0];
    if (this.imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  onpenCreateDialog() {
    this.error = null;
    this.comboRequest = {
      name: '',
      price: 0,
      comboDetails: []
    };
    this.visibleAdd = true;

  }


  onFoodSelect(selectedFoodId: number, index: number) {
    const currentFood = this.comboRequest.comboDetails[index];
    const existingFoodIndex = this.comboRequest.comboDetails.findIndex(
      (f, i) => f.foodId === selectedFoodId && i !== index
    );
    if (existingFoodIndex !== -1) {
      this.comboRequest.comboDetails[existingFoodIndex].quantity += currentFood.quantity || 1;

      this.comboRequest.comboDetails.splice(index, 1);
    } else {
      currentFood.foodId = selectedFoodId;
    }
  }


  addFood() {
    if (!this.comboRequest.comboDetails.find(food => food.foodId == -1)) {
      this.comboRequest.comboDetails.push({ foodId: -1, quantity: 1 });
    }

  }

  removeFood(index: number) {
    this.comboRequest.comboDetails.splice(index, 1);
  }

  saveCombo() {

    if (this.comboRequest.name.trim().length === 0) {
      this.error = "Vui lòng nhập tên!"
    } else if (this.comboRequest.price <= 0) {
      this.error = "Giá không hợp lệ!"
    }
    else if (!this.imageFile) {
      this.error = 'Vui lòng chọn ảnh!'
    } else if ((this.comboRequest.comboDetails.length === 1 && this.comboRequest.comboDetails[0].foodId === -1)
      || this.comboRequest.comboDetails.length === 0) {
      this.error = 'Vui lòng chọn đồ ăn!'
    }
    else {
      this.#combo.createCombo(this.comboRequest, this.imageFile).subscribe(
        res => {
          if (res.status === success) {
            this.getCombos();
          } else {
            this.#toast.error(res.message);
          }
        });
      this.visibleAdd = false;
    }
  }
  onSearchChange() {
    this.getCombos();
  }
  onDelete(combo: ComboResponse) {
    this.#confirm.confirm({
      message: 'Bạn có chắc muốn xóa "' + combo.name + '" không ?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.#combo.deleteCombo(combo.id).subscribe(
          res => {
            if (res.status === success) {
              this.#toast.success("Xóa thành công!");
              this.getCombos();
            } else {
              this.#toast.error(res.message);
            }
          });
      },
      reject: () => {
      }
    });

  }
}


interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
