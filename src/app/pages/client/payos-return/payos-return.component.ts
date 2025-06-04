import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-payos-return',
  standalone: true,
  imports: [CommonModule,ButtonModule],
  templateUrl: './payos-return.component.html',
  styleUrl: './payos-return.component.scss'
})
export class PayosReturnComponent {
  readonly route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  result!: PaymentResult;
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const id = params['id'];
      const cancel = params['cancel'];
      const status = params['status'];
      const orderCode = params['orderCode'];
      let paymentStatus = false;
      let message = 'Giao dịch thất bại';

      if (code === '00' && cancel !== 'true' && status === 'PAID') {
        paymentStatus = true;
        message = 'Giao dịch thành công';
      } else if (cancel === 'true') {
        message = 'Giao dịch đã bị hủy';
      } else if (status === 'PENDING') {
        message = 'Giao dịch đang chờ thanh toán';
      }

      this.result = {
        paymentStatus,
        message,
      };

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