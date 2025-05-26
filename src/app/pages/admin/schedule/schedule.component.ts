import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, InputTextModule, DropdownModule
    , CalendarModule, FormsModule, TableModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {
  cinemas = [
    { name: 'Rạp HaUI', code: 'haui' },
    { name: 'Rạp CGV', code: 'cgv' }
  ];
  rooms = [
    { name: 'Phòng 1', type: '2D', seats: 162 }
  ];

  selectedDate: Date = new Date();

  showtimes = [
    { time: '08:00 - 10:15', title: 'THE LITTLE MERMAID NÀNG TIÊN CÁ', status: 'OFFLINE' },
    { time: '10:25 - 12:40', title: 'THE LITTLE MERMAID NÀNG TIÊN CÁ', status: 'OFFLINE' },
    { time: '12:50 - 15:05', title: 'THE LITTLE MERMAID NÀNG TIÊN CÁ', status: 'OFFLINE' },
    { time: '15:15 - 17:30', title: 'THE LITTLE MERMAID NÀNG TIÊN CÁ', status: 'ONLINE' },
    { time: '17:40 - 19:55', title: 'THE LITTLE MERMAID NÀNG TIÊN CÁ', status: 'ONLINE' },
    { time: '20:05 - 22:20', title: 'THE LITTLE MERMAID NÀNG TIÊN CÁ', status: 'ONLINE' },
  ];
}
