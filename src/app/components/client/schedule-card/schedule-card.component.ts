import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ScheduleForCinemaResponse, RoomScheduleResponse, TimeScheduleDto } from '../../../models/schedule';
import { TabMenuModule } from 'primeng/tabmenu';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-schedule-card',
  standalone: true,
  imports: [TabMenuModule, CommonModule, DialogModule],
  templateUrl: './schedule-card.component.html',
  styleUrl: './schedule-card.component.scss'
})
export class ScheduleCardComponent implements OnInit {

  @Input() schedule: ScheduleForCinemaResponse[] = [];
  @Input() isShowTab: boolean = true;
  @Input() movieName = ''
  visible = false;
  menuItems: MenuItem[] = [];
  activeItem: MenuItem | undefined;
  scheduleDay: RoomScheduleResponse[] = [];
  time: string = '';
  date: Date = new Date();
  cinemaName = '';
  schedulePicked!: number;
  ngOnInit(): void {
    this.cinemaName = localStorage.getItem("cinemaName") ?? '';
  }

  ngOnChanges(): void {
    this.menuItems = this.schedule.map((item, index) => ({
      label: this.getLabel(new Date(item.date)),
      id: index.toString()
    }));
    if (this.menuItems.length > 0) {
      this.activeItem = this.menuItems[0];
      this.scheduleDay = this.schedule[0].roomSchedules;
      this.date = this.schedule[0].date;
    }
  }
  onActiveItemChange(item: MenuItem): void {
    if (item) {
      const index = parseInt(item.id ?? '-1', 10);
      if (!isNaN(index) && this.schedule[index]) {
        this.scheduleDay = this.schedule[index].roomSchedules;
        this.date = this.schedule[index].date;
      }
    }
  }
  onBuyTicket(time: TimeScheduleDto) {
    this.visible = true;
    this.time = (time.time);
    this.schedulePicked = time.id;
  }
  readonly getLabel = (date: Date): string => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    });
  };
  convertTimeString(timeStr: string): string {
    const [hours, minutes] = timeStr.split(':');
    return `${hours}:${minutes}`;
  }

}
