import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ListSubscriptionsPage } from './list-subscriptions';

describe('ListSubscriptionsPageComponent', () => {
    let component: ListSubscriptionsPage;
    let fixture: ComponentFixture<ListSubscriptionsPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [IonicModule.forRoot(), ListSubscriptionsPage],
        }).compileComponents();

        fixture = TestBed.createComponent(ListSubscriptionsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
