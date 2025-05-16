import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from '../../components/client/header/header.component';
import { FooterComponent } from "../../components/client/footer/footer.component";
import { CustomerService } from '../../services/customer/customer.service';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToastModule, FooterComponent,NgxSpinnerModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {
  
}
