import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRoomComponent } from './manage-room.component';

describe('ManageRoomComponent', () => {
  let component: ManageRoomComponent;
  let fixture: ComponentFixture<ManageRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRoomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
