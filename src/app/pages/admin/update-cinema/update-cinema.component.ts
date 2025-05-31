import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
import { AddressService } from '../../../services/address/address.service';
import { CinemaService } from '../../../services/cinema/cinema.service';
import { ToastService } from '../../../services/toast/toast.service';
import { PaginatorModule } from 'primeng/paginator';
import { CinemaGetRoomRequest, CinemaResponse } from '../../../models/cinema';
import { RoomService } from '../../../services/room/room.service';
import { RoomTypeEnum, success } from '../../../utils/constants';
import { RoomResponse } from '../../../models/room';
import { PageRequest } from '../../../models/page';
import { noWhiteSpace, isPhoneNumber } from '../../../utils/validator';
import { Province, District, Ward } from '../../../models/location';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-update-cinema',
  standalone: true,
  providers: [ConfirmationService],
  imports: [CommonModule, ReactiveFormsModule, InputTextModule
    , ButtonModule, NgSelectModule, FormsModule, DialogModule
    , MultiSelectModule, DropdownModule, InputNumberModule, ButtonModule
    , CheckboxModule, CalendarModule, InputTextareaModule, PaginatorModule
    , TableModule, ConfirmDialogModule,RouterModule],
  templateUrl: './update-cinema.component.html',
  styleUrl: './update-cinema.component.scss'
})
export class UpdateCinemaComponent {
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private datePipe: DatePipe) { }
  readonly #toast = inject(ToastService);
  readonly #cinema = inject(CinemaService);
  readonly #address = inject(AddressService);
  readonly #room = inject(RoomService);
  readonly #confirm = inject(ConfirmationService);
  cinema!: CinemaResponse;
  rooms: RoomResponse[] = [];
  cinemaId!: number;
  updateCinemaForm!: FormGroup;
  updateSubmit = false;
  pagination: PageEvent = { first: 0, rows: 5, page: 0, pageCount: 0 };
  provinces: Province[] = [];
  districts: District[] = [];
  wards: Ward[] = [];
  visible = false;
  roomType = [
    { label: '2D', value: RoomType._2D },
    { label: '3D', value: RoomType._3D },
    { label: '4D', value: RoomType._4D }
  ];
  creatRoomForm!: FormGroup;
  createSubmit = false;

  ngOnInit() {
    this.initForm();
    const cinemaId = +this.route.snapshot.paramMap.get('id')!;
    if (cinemaId) this.cinemaId = cinemaId;
    this.#address.getProvinces().subscribe(
      res => {
        this.provinces = res;
      }
    )
    this.getCinemaDetail();
    this.getRooms();
  }
  getCinemaDetail() {
    this.#cinema.getCinemaDetail(this.cinemaId).subscribe(
      res => {
        if (res.status === success) {
          this.cinema = res.data;
          this.updateCinemaForm.patchValue({ ...this.cinema });
        } else {
          this.#toast.error(res.message);
        }
      }
    );
  }
  initForm() {
    this.updateCinemaForm = this.formBuilder.group({
      cinemaName: ['', [Validators.required, noWhiteSpace()]],
      hotline: ['', [Validators.required, noWhiteSpace()], [isPhoneNumber()]],
      province: ['', [Validators.required, noWhiteSpace()]],
      district: ['', [Validators.required, noWhiteSpace()]],
      ward: ['', [Validators.required, noWhiteSpace()]],
      detailAddress: ['', [Validators.required, noWhiteSpace()]],
    });
    this.creatRoomForm = this.formBuilder.group({
      name: ['', [Validators.required, noWhiteSpace()]],
      numberOfRow: [6, [Validators.required]],
      numberOfColumn: [6, [Validators.required]],
      roomTypeEnum: ['', [Validators.required, noWhiteSpace()]],
    });
  }
  getRooms() {
    const request: CinemaGetRoomRequest = {
      pageNo: this.pagination.page,
      pageSize: this.pagination.rows,
      sortBy: 'id',
      isAscending: false,
      cinemaId: this.cinemaId
    }
    this.#cinema.getRoomByCinema(request).subscribe(
      res => {
        if (res.status === success) {
          this.rooms = res.data.items;
          this.pagination.page = res.data.pageNo;
          this.pagination.rows = res.data.pageSize;
          this.pagination.pageCount = res.data.totalElements;
          this.pagination.first = res.data.pageNo * res.data.pageSize;
        } else {
          this.#toast.error(res.message);
        }
      }
    );
  }
  onPageChange(event: any) {
    this.pagination.page = event.page;
    this.pagination.rows = event.rows;
    this.getRooms();
  }
  onProvinceSelect(event: any) {
    if (event) {
      const province = this.provinces.find(p => p.name === event);
      if (province)
        this.#address.getDistricts(province.code).subscribe(
          res => {
            this.districts = res;
            this.updateCinemaForm.patchValue(
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
            this.updateCinemaForm.patchValue(
              {
                ward: ''
              }
            );
          }
        )
    }
  }

  onUpdateCinema() {
    this.updateSubmit = true;
    if (!this.updateCinemaForm.valid) return;
    this.#cinema.updateCinema(this.cinemaId, { ...this.updateCinemaForm.value }).subscribe(
      res => {
        if (res.status === success) {
          this.#toast.success("Cập nhật thành công !");
        } else {
          this.#toast.error(res.message);
        }
      }
    );
  }
  getRoomType(type: string) {
    switch (type) {
      case '_2D': return '2D';
      case '_3D': return '3D';
      case '_4D': return '4D';
      default: return '';
    }
  }
  onOpenCreate() {
    this.createSubmit=false;
    this.creatRoomForm.reset();
    this.visible = true;
  }

  onCreateRoom() {
    this.createSubmit = true;
    if (!this.creatRoomForm.valid) return;
    this.#room.createRoom({ cinemaId: this.cinemaId, ...this.creatRoomForm.value }).subscribe(
      res => {
        if (res.status === success) {
          this.#toast.success("Tạo phòng thành công !");
          this.getRooms();
          this.visible = false;
        } else {
          this.#toast.error(res.message);
        }
      }
    );
  }
  confirmDelete(room: RoomResponse) {
    this.#confirm.confirm({
      message: 'Bạn có chắc muốn xóa phòng "' + room.name + '" không ?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.#room.deleteRoom(room.id).subscribe(
          (res) => {
            if (res.status === success) {
              this.#toast.success("Xóa thành công!");
              this.getRooms();
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
}
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
export enum RoomType {
  _2D,
  _3D,
  _4D
}
