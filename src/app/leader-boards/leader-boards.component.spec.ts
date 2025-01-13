import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderBoardsComponent } from './leader-boards.component';

describe('LeaderBoardsComponent', () => {
  let component: LeaderBoardsComponent;
  let fixture: ComponentFixture<LeaderBoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderBoardsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
