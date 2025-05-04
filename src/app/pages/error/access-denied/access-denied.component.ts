import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.scss'
})
export class AccessDeniedComponent {
  #router = inject(Router);

  goHome() {
    this.#router.navigate(['/']).then(
      () => window.location.reload()
    );
  }
}
