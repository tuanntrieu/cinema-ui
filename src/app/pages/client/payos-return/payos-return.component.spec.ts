import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayosReturnComponent } from './payos-return.component';

describe('PayosReturnComponent', () => {
  let component: PayosReturnComponent;
  let fixture: ComponentFixture<PayosReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayosReturnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayosReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
