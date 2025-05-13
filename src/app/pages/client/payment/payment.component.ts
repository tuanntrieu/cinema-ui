import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../../services/ticket/ticket.service';
import { ToastService } from '../../../services/toast/toast.service';
import { success } from '../../../utils/constants';
import { OrderRequest } from '../../../models/ticket';
import { HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  readonly #toast = inject(ToastService);
  readonly #ticket = inject(TicketService);
  readonly route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  orderRequest!: OrderRequest;
  result!: PaymentResult;
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const httpParams = new HttpParams({ fromObject: params });
      const txnRef = params['vnp_TxnRef'];
      const vnp_SecureHash = params['vnp_SecureHash'];
      this.#ticket.handleReturn(vnp_SecureHash, httpParams).subscribe(
        (res) => {
          if (res.status === success) {
            if (res.data.paymentStatus) {
              this.#ticket.existById(txnRef).subscribe(
                (resEx) => {
                  console.log(resEx);
                  if (resEx.status == success) {
                    if (resEx.data) {
                      this.result = res.data;
                    }
                    else {
                      this.#ticket.readDataTmp(txnRef).subscribe(
                        (resIn) => {
                          if (resIn.status === success) {
                            this.orderRequest = resIn.data;
                            this.orderRequest.id = txnRef;
                            if (this.orderRequest) {
                              this.#ticket.checkOut(this.orderRequest).subscribe(
                                (resOr) => {
                                  console.log(resOr);
                                  if (resOr.status === success) {
                                    this.result = res.data;
                                    console.log(this.result);
                                  } else {
                                    this.#toast.error(resOr.message)
                                  }
                                }
                              );
                            }
                          }
                          else {
                            this.#toast.error(resIn.message);
                            this.#router.navigate(['/']);
                          }
                        }
                      );
                    }
                  }
                }
              )
            } else {
              this.result = res.data;
            }
          } else {
            this.#toast.error(res.message);
            this.#router.navigate(['/']);
          }
        }
      );

    });
  }
  navigate() {
    if (this.result) {
      const target = this.result.paymentStatus ? '/order-history' : '/';
      this.#router.navigate([target]);
    }
  }
}
interface PaymentResult {
  message: string;
  paymentStatus: boolean;
}
