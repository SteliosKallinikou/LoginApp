import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPageOlderComponent } from './test-page-older.component';

describe('TestPageOlderComponent', () => {
  let component: TestPageOlderComponent;
  let fixture: ComponentFixture<TestPageOlderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestPageOlderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestPageOlderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
