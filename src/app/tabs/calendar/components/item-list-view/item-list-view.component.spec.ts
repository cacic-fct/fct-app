import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ItemListViewComponent } from './item-list-view.component';

describe('ItemListViewComponent', () => {
  let component: ItemListViewComponent;
  let fixture: ComponentFixture<ItemListViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ItemListViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
