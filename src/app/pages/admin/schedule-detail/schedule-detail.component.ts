import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputNumberModule } from 'primeng/inputnumber';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ComboResponse, ComboSearchRequest, ComboOrderRequest } from '../../../models/combo';
import { Customer } from '../../../models/customer';
import { RoomOrderResponse } from '../../../models/room';
import { SeatResponse } from '../../../models/seat';
import { DataCacheRequest } from '../../../models/ticket';
import { ComboService } from '../../../services/combo/combo.service';
import { CustomerService } from '../../../services/customer/customer.service';
import { PaginationStateService } from '../../../services/pagination/pagination-state.service';
import { RoomService } from '../../../services/room/room.service';
import { SeatService } from '../../../services/seat/seat.service';
import { TicketService } from '../../../services/ticket/ticket.service';
import { ToastService } from '../../../services/toast/toast.service';
import { WebsocketService } from '../../../services/websocket/websocket.service';
import { success, SeatStatus } from '../../../utils/constants';

@Component({
  selector: 'app-schedule-detail',
  standalone: true,
  imports: [BreadcrumbModule, CommonModule, TableModule, PaginatorModule, InputNumberModule, FormsModule],
  templateUrl: './schedule-detail.component.html',
  styleUrl: './schedule-detail.component.scss'
})
export class ScheduleDetailComponent {
  readonly #toast = inject(ToastService);
  readonly #room = inject(RoomService);
  readonly #seat = inject(SeatService);
  readonly #websocket = inject(WebsocketService);
  readonly #router = inject(Router);
  readonly #combo = inject(ComboService);
  readonly stateKey = "place-order";
  readonly #paginationState = inject(PaginationStateService);
  readonly #ticket = inject(TicketService);
  readonly #customer = inject(CustomerService);

  pagination: PageEvent = { first: 0, rows: 3, page: 0, pageCount: 0 };
  roomOrder!: RoomOrderResponse;
  seatGrid: (RoomOrderResponse['seats'][0] | null)[][] = [];

  homeItem: MenuItem = { label: 'Trang chủ', routerLink: ['/'] };
  breadcrumbItems: MenuItem[] = [];

  scheduleId = 0;
  countdownTime: string = '10:00';
  private countdownInterval: any;
  private remainingSeconds = 600;
 
  totalPrice: number = 0;
  totalCombo: number = 0;
  nameSelected: string[] = [];
  seat: SeatResponse[] = [];
  seatId: number[] = [];
  comboResponse: ComboResponse[] = [];

  standardNote = '';
  vipNote = '';
  coupleNote = '';
  user!: Customer;
  email = '';
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.scheduleId = +this.route.snapshot.paramMap.get('id')!;
    this.buidRoomOrder();
    this.#websocket.subscribeToSeatExpired(this.scheduleId, () => this.buidRoomOrder());
    const username = this.#customer.getCurrentUser();
    if (username) {
      this.email = username;
      this.#customer.currentUser$.subscribe(user => {
        if (user) {
          this.user = user;
        }
      })
    }
  }
  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
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
          this.roomOrder.seats.forEach(seat => {
            if (seat.seatStatus === SeatStatus.SELECTED) {
              if (!this.seatId.includes(seat.seatId)) {
                this.seatId.push(seat.seatId);
              }
              if (!this.seat.some(s => s.seatId === seat.seatId)) {
                this.seat.push(seat);
              }
              if (!this.nameSelected.includes(seat.seatName)) {
                this.nameSelected.push(seat.seatName);
              }
            }
          });
          this.updateNotesAndTotal();
        } else {
          this.#toast.error(res.message);
        }
      },
      error: (err) => {
        this.#toast.error(err);
      }
    });
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

  getUrlImage(seat: any): string {
    const seatType = seat?.seatType || 'standard';
    const seatStatus = seat?.seatStatus || 'available';
    return `assets/images/seats/${seatType}_${seatStatus}.png`;
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
      case 'MAINTENANCE': return 'maintenance';
      default: return '';
    }
  }


  updateNotesAndTotal() {
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

    ;
    this.totalPrice = this.seat.reduce((sum, s) => sum + s.price, 0);
    this.totalPrice += this.totalCombo;
  }


}
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
