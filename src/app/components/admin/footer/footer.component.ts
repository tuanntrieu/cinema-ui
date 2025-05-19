import { Component } from '@angular/core';
import { LayoutService } from '../../../services/layout/layout.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent 
{
    constructor(public layoutService: LayoutService) { }
}
