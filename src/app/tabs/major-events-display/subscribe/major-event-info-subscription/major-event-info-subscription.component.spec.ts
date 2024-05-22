import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MajorEventInfoSubscriptionComponent } from './major-event-info-subscription.component';

describe('MajorEventInfoSubscriptionComponent', () => {
  let component: MajorEventInfoSubscriptionComponent;
  let fixture: ComponentFixture<MajorEventInfoSubscriptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MajorEventInfoSubscriptionComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MajorEventInfoSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
