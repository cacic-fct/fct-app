import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ListEventSubscriptionsPage } from './list-event-subscriptions';

describe('ListEventSubscriptionsPageComponent', () => {
  let component: ListEventSubscriptionsPage;
  let fixture: ComponentFixture<ListEventSubscriptionsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ListEventSubscriptionsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ListEventSubscriptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
