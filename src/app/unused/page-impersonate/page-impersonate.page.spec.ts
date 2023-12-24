import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PageImpersonatePage } from './page-impersonate.page';

describe('PageImpersonatePage', () => {
    let component: PageImpersonatePage;
    let fixture: ComponentFixture<PageImpersonatePage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), PageImpersonatePage]
}).compileComponents();

        fixture = TestBed.createComponent(PageImpersonatePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
