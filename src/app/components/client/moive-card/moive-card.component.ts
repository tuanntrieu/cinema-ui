import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MovieResponse } from '../../../models/movie';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { createSafeTrailerUrl } from '../../../utils/safe-url';

@Component({
  selector: 'app-moive-card',
  standalone: true,
  imports: [CommonModule, RouterModule, DialogModule],
  templateUrl: './moive-card.component.html',
  styleUrl: './moive-card.component.scss'
})
export class MoiveCardComponent {

  @Input() isComing!: boolean;
  @Input() movie!: MovieResponse;
  @Output() buyTicket = new EventEmitter<{ movieId: number; name: string }>();

  hover = false;
  trailerDialogVisible = false;
  safeTrailerUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) { }

  onBuyTicketClick() {
    this.buyTicket.emit({ movieId: this.movie.id, name: this.movie.name });
  }

  openTrailerDialog(trailerUrl: string, event: MouseEvent): void {
    event.stopPropagation();
    this.safeTrailerUrl = createSafeTrailerUrl(trailerUrl, this.sanitizer);
    this.trailerDialogVisible = true;
  }

}
