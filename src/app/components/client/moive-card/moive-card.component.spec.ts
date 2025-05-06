import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoiveCardComponent } from './moive-card.component';

describe('MoiveCardComponent', () => {
  let component: MoiveCardComponent;
  let fixture: ComponentFixture<MoiveCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoiveCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoiveCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
