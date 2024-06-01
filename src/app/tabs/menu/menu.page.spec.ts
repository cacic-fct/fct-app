import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MenuPage } from './menu.page';

describe('TabInfoPage', () => {
  let component: MenuPage;
  let fixture: ComponentFixture<MenuPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MenuPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
