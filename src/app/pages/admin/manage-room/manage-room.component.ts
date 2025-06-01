import { CommonModule, DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
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
import { ToastService } from '../../../services/toast/toast.service';
import { RoomService } from '../../../services/room/room.service';
import { ActivatedRoute } from '@angular/router';
import { RoomDetailResponse, RoomOrderResponse } from '../../../models/room';
import { RoomTypeEnum, SeatStatus, SeatType, success } from '../../../utils/constants';
import { RoomType } from '../update-cinema/update-cinema.component';
import { SeatResponse } from '../../../models/seat';
import { SeatService } from '../../../services/seat/seat.service';
import { RadioButtonModule } from 'primeng/radiobutton';
@Component({
  selector: 'app-manage-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule,NgOptimizedImage
    , ButtonModule, NgSelectModule, FileUploadModule, FormsModule
    , MultiSelectModule, DropdownModule, InputNumberModule, ButtonModule
    , CheckboxModule, CalendarModule, InputTextareaModule, RadioButtonModule],
  templateUrl: './manage-room.component.html',
  styleUrl: './manage-room.component.scss'
})
export class ManageRoomComponent {
  readonly #toast = inject(ToastService);
  readonly #room = inject(RoomService);
  readonly #seat = inject(SeatService);
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute) { }
  room!: RoomDetailResponse;
  enable = true;
  roomId!: number;
  type!: RoomTypeEnum;
  seatGrid: (RoomOrderResponse['seats'][0] | null)[][] = [];
  nameSelected: string[] = [];
  seat: SeatResponse[] = [];
  seatMaintain: SeatResponse[] = [];
  seatId: number[] = [];
  ngOnInit() {
    const roomId = +this.route.snapshot.paramMap.get('id')!;
    if (roomId) this.roomId = roomId;
    this.initData();
  }
  roomType = [
    { label: '2D', value: '_2D' },
    { label: '3D', value: '_3D' },
    { label: '4D', value: '_4D' }
  ];



  selectedRowIndex: number | null = null;

  onClearRow() {
    this.selectedRowIndex = null;
  }
  onSeatTypeChange(event: any) {
    this.selectedSeatType = event.value.value;

    switch (this.selectedSeatType) {
      case "STANDARD": {
        this.#seat.updateStandardSeats({ roomId: this.roomId, row: Number(this.selectedRowIndex) }).subscribe(
          res => {
            if (res.status === success) {
              this.#toast.success("Cập nhật thành công!");
              this.initData();
              this.selectedSeatType=null;
            } else {
              this.#toast.error(res.message);
            }
          }
        )
        return;
      }
      case "VIP": {
        this.#seat.updateVipSeats({ roomId: this.roomId, row: Number(this.selectedRowIndex) }).subscribe(
          res => {
            if (res.status === success) {
              this.#toast.success("Cập nhật thành công!");
              this.initData();
              this.selectedSeatType=null;

            } else {
              this.#toast.error(res.message);
            }
          }
        )
        return;
      }
      case "COUPLE": {
        this.#seat.updateCoupleSeats({ roomId: this.roomId, row: Number(this.selectedRowIndex) }).subscribe(
          res => {
            if (res.status === success) {
              this.#toast.success("Cập nhật thành công!");
              this.initData();
              this.selectedSeatType=null;
            } else {
              this.#toast.error(res.message);
            }
          }
        )
        return;
      }
      default: { return; }
    }
  }

  getRoomType(type: string) {
    switch (type) {
      case '_2D': return '2D';
      case '_3D': return '3D';
      case '_4D': return '4D';
      default: return '';
    }
  }

  initData() {
    this.seat = [];
    this.nameSelected = [];
    this.seatId = [];
    this.#room.getRoomDetail(this.roomId).subscribe(
      res => {
        if (res.status === success) {
          this.room = res.data;
          this.type = this.room.roomType;
          this.seatMaintain = this.room.seats.filter(seat => seat.seatStatus === SeatStatus.MAINTENANCE);
          this.buildSeatGrid();
        } else {
          this.#toast.error(res.message);
        }
      }
    );
    this.#room.validateRoom(this.roomId).subscribe(
      res => {
        if (res.status === success) {
          this.enable = res.data.data;
        } else {
          this.#toast.error(res.message);
        }
      }
    )
  }
  buildSeatGrid() {
    const maxX = Math.max(...this.room.seats.map(s => s.xcoordinate));
    const maxY = Math.max(...this.room.seats.map(s => s.ycoordinate));
    this.seatGrid = Array.from({ length: maxX }, () =>
      Array.from({ length: maxY }, () => null)
    );
    for (const seat of this.room.seats) {
      this.seatGrid[seat.xcoordinate - 1][seat.ycoordinate - 1] = seat;
    }
  }
  getUrlImage(seat: any): string {
    const seatType = seat?.seatType || 'standard';
    const seatStatus = seat?.seatStatus || 'available';
    return `assets/images/seats/${seatType}_${seatStatus}.png`;
  }
  onSeatClick(seat: SeatResponse | null) {

    if (seat) {
      if (this.seat.length >= 8 && seat.seatStatus != SeatStatus.SELECTED) {
        this.#toast.error("Bạn chỉ được chọn tối đa 8 ghế");
        return;
      }
      const index = this.seat.findIndex(s => s.seatId === seat.seatId);
      seat.seatStatus = seat.seatStatus === SeatStatus.SELECTED ? (this.seatMaintain.find(s => s.seatId === seat.seatId) ? SeatStatus.MAINTENANCE : SeatStatus.AVAILABLE) : SeatStatus.SELECTED;
      if (index === -1) {
        this.seatId.push(seat.seatId);
        this.seat.push(seat);
        this.nameSelected.push(seat.seatName);
      } else {
        this.seat.splice(index, 1);
        this.seatId.splice(index, 1);
        this.nameSelected.splice(index, 1);
      }
    }
  }
  onSelectChange() {
    this.#room.updateRoomType(this.roomId, this.type).subscribe(
      res => {
        if (res.status === success) {
          this.#toast.success("Cập nhật thành công!");
        } else {
          this.#toast.error(res.message);
        }
      }
    )
  }
  getSeatClass(seat: RoomOrderResponse['seats'][0] | null): string {
    if (!seat) return '';
    switch (seat.seatStatus) {
      case 'AVAILABLE': return 'available';
      case 'MAINTENANCE': return 'maintenance';
      default: return '';
    }
  }
  seatTypeOptions = [
    { label: 'Ghế thường', value: 'STANDARD' },
    { label: 'Ghế VIP', value: 'VIP' },
    { label: 'Ghế đôi', value: 'COUPLE' }
  ];

  selectedSeatType: string | null = null;

  setMaintenance() {
    this.#seat.maintainSeat(this.seatId).subscribe(
      res => {
        if (res.status === success) {
          this.#toast.success("Cập nhật thành công!");
          this.initData()
        }
        else {
          this.#toast.error(res.message);
        }
      }
    );
  }

  unMaintenance() {
    this.#seat.unMaintainSeat(this.seatId).subscribe(
      res => {
        if (res.status === success) {
          this.#toast.success("Cập nhật thành công!");
          this.initData();

        }
        else {
          this.#toast.error(res.message);
        }
      }
    );
  }

}
