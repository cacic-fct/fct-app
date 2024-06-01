import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MajorEventDescriptionComponent } from './major-event-description.component';

describe('MajorEventDescriptionComponent', () => {
  let component: MajorEventDescriptionComponent;
  let fixture: ComponentFixture<MajorEventDescriptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MajorEventDescriptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MajorEventDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
