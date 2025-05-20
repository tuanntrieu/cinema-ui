import { Component, inject } from '@angular/core';
import { MovieTypeService } from '../../../services/movie-type/movie-type.service';
import { ToastService } from '../../../services/toast/toast.service';
import { success } from '../../../utils/constants';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { MovieTypeSearchRequest } from '../../../models/movie';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { noWhiteSpace } from '../../../utils/validator';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-movie-type',
  standalone: true,
  providers: [ConfirmationService],
  imports: [TableModule, CommonModule,
    PaginatorModule, ButtonModule,
    ConfirmDialogModule, DialogModule,
    FormsModule, ReactiveFormsModule,
    InputTextModule],
  templateUrl: './movie-type.component.html',
  styleUrl: './movie-type.component.scss'
})
export class MovieTypeComponent {
  readonly #type = inject(MovieTypeService);
  readonly #toast = inject(ToastService);
  readonly #confirm = inject(ConfirmationService);
  movieType: MovieTypeResponse[] = [];
  pageType: PageEvent = { first: 0, rows: 8, page: 0, pageCount: 0 };
  visibleAdd = false;
  createForm!: FormGroup;
  createSubmitted = false;

  visibleEdit = false;
  editForm!: FormGroup;
  editSubmitted = false;
  editId = 0;
  typeSearch = '';

  constructor(private formBuilder: FormBuilder) { }
  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      name: ['', [Validators.required, noWhiteSpace()]],
    });
    this.editForm = this.formBuilder.group({
      name: ['', [Validators.required, noWhiteSpace()]],
    });
    this.getMovieType();
  }
  onAddClick() {
    this.createSubmitted = false;
    this.visibleAdd = true;
    this.createForm.patchValue({
      name: ''
    });
  }
  onEditClick(item: MovieTypeResponse) {
    this.editId = item.id;
    this.editForm.patchValue({
      name: item.name
    });
    this.editSubmitted = false;
    this.visibleEdit = true;
  }
  onSearchChange() {
    this.getMovieType();
  }
  edit() {
    this.editSubmitted = true;
    if (!this.editForm.valid) {
      return;
    }
    this.#type.updateMovieType(this.editId, { name: this.editForm.value['name'] }).subscribe(
      (res) => {
        if (res.status === success) {
          this.#toast.success("Cập nhật thành công !");
          this.visibleEdit = false;
          this.getMovieType();
        } else {
          this.#toast.error(res.message);
        }
      }
    );
  }
  create() {
    this.createSubmitted = true;
    if (!this.createForm.valid) {
      return;
    }
    this.#type.createMovieType({ name: this.createForm.value['name'] }).subscribe(
      (res) => {
        if (res.status === success) {
          this.#toast.success("Thêm thành công !");
          this.visibleAdd = false;
          this.getMovieType();
        } else {
          this.#toast.error(res.message);
        }
      }
    );
  }

  onPageChange(event: any) {
    this.pageType.page = event.page;
    this.pageType.rows = event.rows;
    this.getMovieType();
  }
  confirmDelete(item: MovieTypeResponse) {
    this.#confirm.confirm({
      message: 'Bạn có chắc muốn xóa thể loại "' + item.name + '" không ?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.#type.deleteMovieType(item.id).subscribe(
          (res) => {
            if (res.status === success) {
              this.#toast.success("Xóa thành công!");
              this.getMovieType();
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



  getMovieType() {
    const request: MovieTypeSearchRequest = {
      pageNo: this.pageType.page,
      pageSize: this.pageType.rows,
      sortBy: 'id',
      isAscending: false,
      name: this.typeSearch
    }

    this.#type.getAllMovieTypePage(request).subscribe(
      {
        next: (res) => {
          if (res.status === success) {
            this.movieType = res.data.items;
            this.pageType.page = res.data.pageNo;
            this.pageType.rows = res.data.pageSize;
            this.pageType.pageCount = res.data.totalElements;
            this.pageType.first = res.data.pageNo * res.data.pageSize;
          } else {
            this.#toast.error(res.message);
          }
        }
      }
    );
  }
}
export interface MovieTypeResponse {
  id: number;
  name: string;
}
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
