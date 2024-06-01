import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EventHeaderComponent } from './event-header.component';

describe('EventHeaderComponent', () => {
  let component: EventHeaderComponent;
  let fixture: ComponentFixture<EventHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EventHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
