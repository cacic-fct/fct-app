import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ListPage } from './list.page';

describe('ListPage', () => {
  let component: ListPage;
  let fixture: ComponentFixture<ListPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
