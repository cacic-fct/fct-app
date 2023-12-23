import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MajorEventsDisplayPage } from './major-events-display.page';

describe('MajorEventsDisplayPage', () => {
  let component: MajorEventsDisplayPage;
  let fixture: ComponentFixture<MajorEventsDisplayPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), MajorEventsDisplayPage],
}).compileComponents();

    fixture = TestBed.createComponent(MajorEventsDisplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
