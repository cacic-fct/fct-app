import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EventCardComponent } from './event-card.component';

describe('EventCardComponent', () => {
    let component: EventCardComponent;
    let fixture: ComponentFixture<EventCardComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [IonicModule.forRoot(), EventCardComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(EventCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
