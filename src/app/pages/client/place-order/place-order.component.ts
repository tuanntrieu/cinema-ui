import { Component, inject, OnDestroy } from '@angular/core';
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
import { ComboOrderRequest, ComboRequest, ComboResponse, ComboSearchRequest } from '../../../models/combo';
import { ComboService } from '../../../services/combo/combo.service';
import { PaginatorModule } from 'primeng/paginator';
import { PaginationStateService } from '../../../services/pagination/pagination-state.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../../services/ticket/ticket.service';
import { CinemaService } from '../../../services/cinema/cinema.service';
import { CustomerService } from '../../../services/customer/customer.service';
import { Customer } from '../../../models/customer';
import { CreateUrlRequest, DataCacheRequest } from '../../../models/ticket';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [BreadcrumbModule, CommonModule, TableModule, PaginatorModule, InputNumberModule, FormsModule, RadioButtonModule],
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss']

})
export class PlaceOrderComponent implements OnDestroy {
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
    this.startCountdown();
    const paginationState = this.#paginationState.getPaginationState(this.stateKey);
    this.pagination.page = paginationState.page;
    this.pagination.rows = paginationState.rows;
    this.getCombo();
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

  getCombo() {
    const request: ComboSearchRequest = {
      pageNo: this.pagination.page,
      pageSize: this.pagination.rows,
      sortBy: 'name',
      isAscending: false,
      name: '',
    };
    this.#combo.getCombo(request).subscribe(
      {
        next: (res) => {
          if (res.status === success) {
            this.comboResponse = res.data.items;
            this.pagination.page = res.data.pageNo;
            this.pagination.rows = res.data.pageSize;
            this.pagination.pageCount = res.data.totalElements;
            this.pagination.first = this.pagination.page * this.pagination.rows;
          }
          else {
            this.#toast.error(res.message)
          }
        }, error: (err) => {
          this.#toast.error(err)
        }
      }
    );
  }
  onPageChange(event: any) {
    this.pagination.page = event.page;
    this.pagination.rows = event.rows;
    this.#paginationState.setPaginationState(this.stateKey, {
      page: this.pagination.page,
      rows: this.pagination.rows
    });
    this.getCombo();
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
      default: return '';
    }
  }

  onSeatClick(seat: SeatResponse) {
    const index = this.seat.findIndex(s => s.seatId === seat.seatId);
    if (seat.seatStatus === SeatStatus.AVAILABLE) {
      this.holdSeat(seat.seatId);
      if (index === -1) { // Ghế chưa được chọn
        this.seat.push(seat);
        this.seatId.push(seat.seatId);
        this.nameSelected.push(seat.seatName);
      }
    } else if (seat.seatStatus === SeatStatus.SELECTED) {
      this.unholdSeat(seat.seatId);
      if (index !== -1) {
        this.seat.splice(index, 1);
        this.seatId.splice(index, 1);
        this.nameSelected.splice(index, 1);
      }
    }
    this.updateNotesAndTotal();
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
    this.countdownInterval = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
        const minutes = Math.floor(this.remainingSeconds / 60).toString().padStart(2, '0');
        const seconds = (this.remainingSeconds % 60).toString().padStart(2, '0');
        this.countdownTime = `${minutes}:${seconds}`;
      } else {
        clearInterval(this.countdownInterval);
        this.#toast.error('Hết thời gian giữ ghế');
        this.#router.navigate(['/']);
      }
    }, 1000);
  }

  onValidate() {
    if (this.seatId.length === 0) {
      this.#toast.error("Vui lòng chọn ghế")
    }
    else if (this.seatId.length > 8) {
      this.#toast.error("Bạn chỉ được chọn tối đa 8 ghế")
    }
    else {
      this.#seat.validateSeat(this.scheduleId, this.seatId).subscribe({
        next: (res) => {
          if (res.status === success) {
            if (res.data.data) {
              if (this.selectedPaymentMethod === "VNPAY") {
                this.paymentVnPay();
              } else if (this.selectedPaymentMethod === "PAYOS") {
                this.paymentPayOs();
              }
            } else {
              this.#toast.error(res.data.message);
            }
          }
          else {
            this.#toast.error(res.message)
          }
        }, error: (err) => {
          this.#toast.error(err)
        }
      })
    }
  }
  paymentPayOs() {
    const request: CreateUrlRequest = {
      amount: this.totalPrice,
      cancelUrl: 'http://localhost:4200/payos-result',
      returnUrl: 'http://localhost:4200/payos-result'
    }
    this.#ticket.getPayOSPaymentUrl(request).subscribe(
      (resIn) => {
        if (resIn.status === success) {
          const vnpTxnRef = resIn.data.orderId;
          const request: DataCacheRequest = {
            vnp_TxnRef: vnpTxnRef ?? '',
            customerId: this.user.id,
            customerName: this.user.fullName,
            customerEmail: this.email,
            movieId: this.roomOrder.movieId,
            scheduleId: this.scheduleId,
            seatId: this.seatId,
            combos: this.comboRq
          }
          this.#ticket.saveDataTmp(request).subscribe(
            (resSave) => {
              if (resSave.status === success) {
                window.location.href = resIn.data.url.toString();
              }
            }
          );
        } else {
          this.#toast.error(resIn.message);
        }
      }
    );
  }
  paymentVnPay() {
    this.#ticket.getPaymentUrl(this.totalPrice).subscribe(
      (resIn) => {
        if (resIn.status === success) {
          const params = new URLSearchParams(resIn.data.url.split('?')[1]);
          const vnpTxnRef = params.get('vnp_TxnRef');
          const request: DataCacheRequest = {
            vnp_TxnRef: vnpTxnRef ?? '',
            customerId: this.user.id,
            customerName: this.user.fullName,
            customerEmail: this.email,
            movieId: this.roomOrder.movieId,
            scheduleId: this.scheduleId,
            seatId: this.seatId,
            combos: this.comboRq
          }
          this.#ticket.saveDataTmp(request).subscribe(
            (resSave) => {
              if (resSave.status === success) {
                window.location.href = resIn.data.url.toString();
              }
            }
          );
        } else {
          this.#toast.error(resIn.message);
        }
      }
    );
  }
  comboRq: ComboOrderRequest[] = [];
  onQuantityChange(event: any, product: ComboResponse) {
    this.totalPrice -= this.totalCombo;
    const existingCombo = this.comboRq.find(combo => combo.comboId === product.id);
    if (existingCombo) {
      const oldQuantity = existingCombo.quantity;
      existingCombo.quantity = event.value;
      this.totalCombo += (event.value - oldQuantity) * product.price;
      this.totalPrice += this.totalCombo
    } else {
      const newCombo: ComboOrderRequest = {
        comboId: product.id,
        quantity: event.value,
      };
      this.comboRq.push(newCombo);
      this.totalCombo += event.value * product.price;
      this.totalPrice += this.totalCombo
    }
  }
  selectedPaymentMethod = 'VNPAY';
}
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
