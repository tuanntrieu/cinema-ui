import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { MovieService } from '../../../services/moive/movie.service';
import { MovieTypeService } from '../../../services/movie-type/movie-type.service';
import { ToastService } from '../../../services/toast/toast.service';
import { MovieTypeResponse } from '../movie-type/movie-type.component';
import { noWhiteSpace, youtubeLinkValidator } from '../../../utils/validator';
import { ActivatedRoute } from '@angular/router';
import { success } from '../../../utils/constants';
import { MovieDetailResponse, MovieRequest, MovieResponse } from '../../../models/movie';

@Component({
  selector: 'app-update-movie',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule
    , ButtonModule, NgSelectModule, FileUploadModule, FormsModule
    , MultiSelectModule, DropdownModule, InputNumberModule, ButtonModule
    , CheckboxModule, CalendarModule, InputTextareaModule],
  templateUrl: './update-movie.component.html',
  styleUrl: './update-movie.component.scss'
})
export class UpdateMovieComponent {
  readonly #toast = inject(ToastService);
  readonly #movie = inject(MovieService);
  readonly #type = inject(MovieTypeService);
  submitted = false;
  error = '';
  updateForm!: FormGroup;
  movieTypes: MovieTypeResponse[] = [];
  imageError = '';
  minDate!: Date;
  minEndDate !: Date;
  imageFile: File | null = null;
  movie!: MovieDetailResponse;
  imagePreview: string | ArrayBuffer | null = null;
  @ViewChild('fileUploader') fileUploader: any;
  movieId!: number;
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private datePipe: DatePipe) { }
  initForm() {
    this.submitted = false;
    this.imageFile = null;
    this.imagePreview = null
    this.minDate = new Date();
    const endDateDefault = new Date(this.minDate);
    endDateDefault.setDate(this.minDate.getDate() + 1);
    this.minEndDate = endDateDefault;
    this.updateForm = this.formBuilder.group({
      name: ['', [Validators.required, noWhiteSpace()]],
      language: ['', [Validators.required, noWhiteSpace()]],
      actors: [''],
      director: [''],
      trailer: ['', youtubeLinkValidator()],
      duration: [60, [Validators.required]],
      ageLimit: [0, [Validators.required]],
      isSub: [false],
      releaseDate: [{ value: new Date(), disabled: false }, [Validators.required]],
      endDate: [new Date(), [Validators.required]],
      description: ['', [Validators.required, noWhiteSpace()]],
      movieTypeId: [[]]
    });


  }
  ngOnInit() {
    this.initForm();
    const movieId = +this.route.snapshot.paramMap.get('id')!;
    this.movieId = movieId;
    this.getMovieType();
    if (movieId) this.getMovieDetai(movieId);
  }
  releaseDateDisabled!: boolean;
  form: any;
  getMovieDetai(id: number) {
    this.#movie.getMovieDetail(id).subscribe(
      {
        next: (res) => {
          if (res.status === success) {
            this.movie = res.data;
            this.releaseDateDisabled = new Date(this.movie.releaseDate) <= new Date();
            if (this.releaseDateDisabled) {
              this.updateForm.get('releaseDate')?.disable();
            } else {
              this.updateForm.get('releaseDate')?.enable();
            }
            this.updateForm.patchValue({
              name: this.movie.name,
              language: this.movie.language,
              actors: this.movie.actors,
              director: this.movie.director,
              trailer: this.movie.trailer,
              duration: this.movie.duration,
              ageLimit: this.movie.ageLimit,
              isSub: this.movie.isSub,
              releaseDate: new Date(this.movie.releaseDate),
              endDate: new Date(this.movie.endDate),
              description: this.movie.description,
              movieTypeId: this.movie.types.map(t => t.id)
            });

            this.imagePreview = this.movie.image;
          } else {
            this.#toast.error(res.message);
          }
        }
      }
    );
  }
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
  onReleaseDateChange() {
    const selected = this.updateForm.value['releaseDate'];
    if (selected) {
      const copy = new Date(selected);
      copy.setDate(copy.getDate() + 1);
      this.minEndDate = copy;
    }
  }
  formatDateOnly(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  saveMovie() {
    this.submitted = true;

    if (!this.updateForm.valid) {
      return;
    }

    const request: MovieRequest = {
      ...this.updateForm.getRawValue()
    }
    request.releaseDate = this.datePipe.transform(request.releaseDate, 'yyyy-MM-dd') ?? '';
    request.endDate = this.datePipe.transform(request.endDate, 'yyyy-MM-dd') ?? '';
    
    this.#movie.updateMovie(this.movieId, request, this.imageFile).subscribe(
      {
        next: (res) => {
          if (res.status === success) {
            this.#toast.success("Cập nhật thành công!");
          } else {
            this.#toast.error(res.message);
          }
        }
      }
    );
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
}
