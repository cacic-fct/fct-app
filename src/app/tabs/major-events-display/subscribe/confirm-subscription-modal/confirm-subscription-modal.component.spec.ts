import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConfirmSubscriptionModalComponent } from './confirm-subscription-modal.component';

describe('ConfirmSubscriptionModalComponent', () => {
  let component: ConfirmSubscriptionModalComponent;
  let fixture: ComponentFixture<ConfirmSubscriptionModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmSubscriptionModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmSubscriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
