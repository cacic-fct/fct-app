import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConfirmAddEventModalComponent } from './confirm-add-event-modal.component';

describe('ConfirmAddEventModalComponent', () => {
  let component: ConfirmAddEventModalComponent;
  let fixture: ComponentFixture<ConfirmAddEventModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmAddEventModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmAddEventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
