import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MajorEventHeaderComponent } from './major-event-header.component';

describe('MajorEventHeaderComponent', () => {
  let component: MajorEventHeaderComponent;
  let fixture: ComponentFixture<MajorEventHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MajorEventHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MajorEventHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
