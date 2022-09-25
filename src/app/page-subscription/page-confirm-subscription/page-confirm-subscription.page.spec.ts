import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PageConfirmSubscriptionPage } from './page-confirm-subscription.page';

describe('PageSubscriptionPage', () => {
  let component: PageConfirmSubscriptionPage;
  let fixture: ComponentFixture<PageConfirmSubscriptionPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PageConfirmSubscriptionPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PageConfirmSubscriptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
