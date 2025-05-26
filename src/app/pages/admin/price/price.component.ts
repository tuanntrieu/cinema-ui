import { Component, inject } from '@angular/core';
import { SeatService } from '../../../services/seat/seat.service';
import { RoomService } from '../../../services/room/room.service';
import { ToastService } from '../../../services/toast/toast.service';
import { RoomTypeEnum, SeatType, success } from '../../../utils/constants';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { RoomTypeResponse, SeatPriceResponse } from '../../../models/seat';

@Component({
  selector: 'app-price',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputNumberModule, TableModule],
  templateUrl: './price.component.html',
  styleUrl: './price.component.scss'
})
export class PriceComponent {
  readonly #seat = inject(SeatService);
  readonly #toast = inject(ToastService);
  readonly #room = inject(RoomService);
  roomTypes: RoomTypeResponse[] = [
    {
      id: 1,
      roomType: RoomTypeEnum._2D,
      surcharge: 0
    },
    {
      id: 2,
      roomType: RoomTypeEnum._3D,
      surcharge: 0
    },
    {
      id: 3,
      roomType: RoomTypeEnum._4D,
      surcharge: 0
    }
  ];
  seatTypes: SeatPriceResponse[] = [
    {
      id: 1,
      weekdayPrice: 0,
      weekendPrice: 0,
      seatType: SeatType.STANDARD
    },
    {
      id: 2,
      weekdayPrice: 0,
      weekendPrice: 0,
      seatType: SeatType.VIP
    },
    {
      id: 3,
      weekdayPrice: 0,
      weekendPrice: 0,
      seatType: SeatType.COUPLE
    }
  ];

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.#seat.getAllSeatPrice().subscribe((res) => {
      if (res.status === success) {
        this.seatTypes = res.data;
      } else {
        this.#toast.error(res.message);
      }
    });

    this.#room.getAllRoomType().subscribe((res) => {
      if (res.status === success) {
        this.roomTypes = res.data;
      } else {
        this.#toast.error(res.message);
      }
    });
  }

  save() {
    this.#seat.updateSeatPrice({ seatRequest: this.seatTypes, roomRequest: this.roomTypes }).subscribe(
      res => {
        if (res.status === success) {
          this.#toast.success("Cập nhật thành công!");
          this.initData();
        } else {
          this.#toast.error(res.message);
        }
      }
    );


  }
  validateSeatPrice(index: number) {
    const seat = this.seatTypes[index];
    seat.weekdayPrice = this.validateNumber(seat.weekdayPrice);
    seat.weekendPrice = this.validateNumber(seat.weekendPrice);
  }

  validateRoomPrice(index: number) {
    const room = this.roomTypes[index];
    room.surcharge = this.validateNumber(room.surcharge);
  }

  validateNumber(value: any): number {
    const num = parseInt(value, 10);
    return isNaN(num) || num < 0 ? 0 : num;
  }

  preventMinus(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }

}



