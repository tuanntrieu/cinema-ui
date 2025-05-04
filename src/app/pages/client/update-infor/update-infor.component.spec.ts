import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInforComponent } from './update-infor.component';

describe('UpdateInforComponent', () => {
  let component: UpdateInforComponent;
  let fixture: ComponentFixture<UpdateInforComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateInforComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateInforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
