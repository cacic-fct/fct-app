import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConfirmAddEventModalPage } from './confirm-add-event-modal.page';

describe('ConfirmAddEventModalPage', () => {
  let component: ConfirmAddEventModalPage;
  let fixture: ComponentFixture<ConfirmAddEventModalPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmAddEventModalPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmAddEventModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
