import { Component, inject } from '@angular/core';
import { RoomService } from '../../../services/room/room.service';
import { ToastService } from '../../../services/toast/toast.service';
import { RoomOrderResponse } from '../../../models/room';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { SeatStatus, success } from '../../../utils/constants';
import { SeatResponse } from '../../../models/seat';
import { SeatService } from '../../../services/seat/seat.service';
import { WebsocketService } from '../../../services/websocket/websocket.service';


@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [BreadcrumbModule, CommonModule, TableModule],
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss']
})
export class PlaceOrderComponent {
  readonly #toast = inject(ToastService);
  readonly #room = inject(RoomService);
  readonly #seat = inject(SeatService)
  readonly #websocket = inject(WebsocketService);
  readonly #route = inject(Router);
  roomOrder!: RoomOrderResponse;
  seatGrid: (RoomOrderResponse['seats'][0] | null)[][] = [];
  homeItem: MenuItem = { label: 'Trang chủ', routerLink: ['/'] };
  breadcrumbItems: MenuItem[] = [];
  scheduleId = 0;
  countdownTime: string = '10:00';
  private countdownInterval: any;
  private remainingSeconds = 600;



  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.scheduleId = +this.route.snapshot.paramMap.get('id')!;
    this.buidRoomOrder();
    this.#websocket.subscribeToSeatExpired(this.scheduleId, (seatId) => {
      this.buidRoomOrder();
    });
    this.startCountdown();
  }
  buidRoomOrder() {
    this.#room.getRoomOrder(this.scheduleId).subscribe({
      next: (res) => {
        if (res.status === success) {
          this.roomOrder = { ...res.data };
          this.breadcrumbItems = [
            { label: 'Đặt vé' },
            { label: this.roomOrder.movieName }
          ];
          this.buildSeatGrid();
        }
        else {
          this.#toast.error(res.message)
        }
      }, error: (err) => {
        this.#toast.error(err)
      }
    });

  }
  getUrlImage(seat: any): string {
    const seatType = seat?.seatType || 'default';
    const seatStatus = seat?.seatStatus || 'available';
    return `assets/images/seats/${seatType}_${seatStatus}.png`;
  }

  buildSeatGrid() {
    const maxX = Math.max(...this.roomOrder.seats.map(s => s.xcoordinate));
    const maxY = Math.max(...this.roomOrder.seats.map(s => s.ycoordinate));
    this.seatGrid = Array.from({ length: maxX }, () =>
      Array.from({ length: maxY }, () => null)
    );
    for (const seat of this.roomOrder.seats) {
      this.seatGrid[seat.xcoordinate - 1][seat.ycoordinate - 1] = seat;
    }
  }
  convertTimeString(timeStr: string): string {
    const [hours, minutes] = timeStr.split(':');
    return `${hours}:${minutes}`;
  }
  getSeatClass(seat: RoomOrderResponse['seats'][0] | null): string {
    if (!seat) return '';
    switch (seat.seatStatus) {
      case 'AVAILABLE': return 'available';
      case 'SOLD': return 'sold';
      case 'HODING': return 'holding';
      case 'SELECTED': return 'selected';
      default: return '';
    }
  }

  totalPrice: number = 0;
  nameSelected: string[] = [];
  seat: SeatResponse[] = [];
  standardNote = '';
  vipNote = '';
  coupleNote = '';
  onSeatClick(seat: SeatResponse) {
    const index = this.seat.findIndex(s => s.seatId === seat.seatId);

    if (seat.seatStatus === SeatStatus.AVAILABLE) {
      this.holdSeat(seat.seatId);
      if (index === -1) {
        this.seat.push(seat);
        this.nameSelected.push(seat.seatName);
      }
    } else if (seat.seatStatus === SeatStatus.SELECTED) {
      this.unholdSeat(seat.seatId);
      if (index !== -1) {
        this.seat.splice(index, 1);
        this.nameSelected.splice(index, 1);
      }
    }
    const typeMap: Record<string, { count: number; total: number }> = {
      STANDARD: { count: 0, total: 0 },
      VIP: { count: 0, total: 0 },
      COUPLE: { count: 0, total: 0 }
    };
    for (const s of this.seat) {
      const type = s.seatType;
      if (typeMap[type]) {
        typeMap[type].count += 1;
        typeMap[type].total += s.price;
      }
    }
    this.standardNote = typeMap['STANDARD'].count > 0
      ? `${typeMap['STANDARD'].count} x ${typeMap['STANDARD'].total / typeMap['STANDARD'].count} = ${typeMap['STANDARD'].total}`
      : '';

    this.vipNote = typeMap['VIP'].count > 0
      ? `${typeMap['VIP'].count} x ${typeMap['VIP'].total / typeMap['VIP'].count} = ${typeMap['VIP'].total}`
      : '';

    this.coupleNote = typeMap['COUPLE'].count > 0
      ? `${typeMap['COUPLE'].count} x ${typeMap['COUPLE'].total / typeMap['COUPLE'].count} = ${typeMap['COUPLE'].total}`
      : '';

    this.totalPrice = this.seat.reduce((sum, s) => sum + s.price, 0);
  }

  holdSeat(seatId: number) {
    this.#seat.holdSeat({ scheduleId: this.scheduleId, seatId: seatId, seatStatus: SeatStatus.AVAILABLE }).subscribe({
      next: (res) => {
        if (res.status === success) {
        }
        else {
          this.#toast.error(res.message)
        }
      }, error: (err) => {
        this.#toast.error(err)
      }
    });
  }
  unholdSeat(seatId: number) {
    this.#seat.unHoldSeat({ scheduleId: this.scheduleId, seatId: seatId, seatStatus: SeatStatus.AVAILABLE }).subscribe({
      next: (res) => {
        if (res.status === success) {
        }
        else {
          this.#toast.error(res.message)
        }
      }, error: (err) => {
        this.#toast.error(err)
      }
    });
  }
  startCountdown() {
    this.updateCountdownDisplay();
    this.countdownInterval = setInterval(() => {
      this.remainingSeconds--;
      this.updateCountdownDisplay();

      if (this.remainingSeconds <= 0) {
        clearInterval(this.countdownInterval);
        this.#route.navigate(['/']);
      }
    }, 1000);
  }

  updateCountdownDisplay() {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    this.countdownTime = `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

}
