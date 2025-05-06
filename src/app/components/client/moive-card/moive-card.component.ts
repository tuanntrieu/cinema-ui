import { CommonModule } from '@angular/common';
import { Component ,Input } from '@angular/core';
import { MovieResponse } from '../../../models/movie';

@Component({
  selector: 'app-moive-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moive-card.component.html',
  styleUrl: './moive-card.component.scss'
})
export class MoiveCardComponent {
  @Input() movie!: MovieResponse;
}
