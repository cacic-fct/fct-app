import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FilterModalPage } from './filter-modal.page';

describe('FilterModalPage', () => {
  let component: FilterModalPage;
  let fixture: ComponentFixture<FilterModalPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FilterModalPage],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
