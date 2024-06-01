import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ListMajorEventSubscriptionsPage } from './list-major-event-subscriptions';

describe('ListMajorEventSubscriptionsPageComponent', () => {
  let component: ListMajorEventSubscriptionsPage;
  let fixture: ComponentFixture<ListMajorEventSubscriptionsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ListMajorEventSubscriptionsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ListMajorEventSubscriptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
