import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MovieService } from '../../../services/moive/movie.service';
import { ToastService } from '../../../services/toast/toast.service';
import { MovieTypeService } from '../../../services/movie-type/movie-type.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { noWhiteSpace, youtubeLinkValidator } from '../../../utils/validator';
import { CalendarModule } from 'primeng/calendar';
import { MovieTypeResponse } from '../movie-type/movie-type.component';
import { success } from '../../../utils/constants';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MovieRequest } from '../../../models/movie';
@Component({
  selector: 'app-create-movie',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule
    , ButtonModule, NgSelectModule, FileUploadModule, FormsModule
    , MultiSelectModule, DropdownModule, InputNumberModule, ButtonModule
    , CheckboxModule, CalendarModule, InputTextareaModule
  ],
  templateUrl: './create-movie.component.html',
  styleUrl: './create-movie.component.scss'
})
export class CreateMovieComponent {
  readonly #toast = inject(ToastService);
  readonly #movie = inject(MovieService);
  readonly #type = inject(MovieTypeService);
  submitted = false;
  error = '';
  createForm!: FormGroup;
  movieTypes: MovieTypeResponse[] = [];
  imageError = '';
  minDate!: Date;
  minEndDate !: Date;
  constructor(private formBuilder: FormBuilder) { }
  initForm() {
    this.submitted = false;
    this.imageFile = null;
    this.imagePreview = null
    this.minDate = new Date();
    const endDateDefault = new Date(this.minDate);
    endDateDefault.setDate(this.minDate.getDate() + 1);
    this.minEndDate = endDateDefault;
    this.createForm = this.formBuilder.group({
      name: ['', [Validators.required, noWhiteSpace()]],
      language: ['', [Validators.required, noWhiteSpace()]],
      actors: [''],
      director: [''],
      trailer: ['', youtubeLinkValidator()],
      duration: [60, [Validators.required]],
      ageLimit: [0, [Validators.required]],
      isSub: [false],
      releaseDate: [new Date(), [Validators.required]],
      endDate: [endDateDefault, [Validators.required]],
      description: ['', [Validators.required, noWhiteSpace()]],
      movieTypeId: [[]]
    });
  }
  ngOnInit() {
    this.initForm();
    this.getMovieType();
  }
  onChange() {
    console.log(this.createForm.value['isSub']);
  }

  getMovieType() {
    this.#type.getAllMovieType().subscribe(
      {
        next: (res) => {
          if (res.status === success) {
            this.movieTypes = res.data;
          } else {
            this.#toast.error(res.message);
          }
        }
      }
    );
  }



  imageFile: File | null = null;
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
    this.error = '';
    if (this.imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  saveMovie() {
    this.submitted = true;
    if (!this.imageFile) {
      this.error = 'Vui lòng chọn ảnh!'
    }
    if (!this.createForm.valid) {
      return;
    }
    if (!this.imageFile) {
      return;
    }
    const request: MovieRequest = {
      ...this.createForm.value
    }
    this.#movie.createMovie(request, this.imageFile).subscribe(
      {
        next: (res) => {
          if (res.status === success) {
            this.#toast.success("Tạo phim thành công!");

            this.initForm();
          } else {
            this.#toast.error(res.message);
          }
        }
      }
    );

  }
  onReleaseDateChange() {
    const selected = this.createForm.value['releaseDate'];
    if (selected) {
      const copy = new Date(selected);
      copy.setDate(copy.getDate() + 1);
      this.minEndDate = copy;
      this.createForm.patchValue({
        endDate: copy
      });
    }
  }

}
