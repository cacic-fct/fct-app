import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListIssuedPage } from './list-issued.page';

describe('ListIssuedPage', () => {
  let component: ListIssuedPage;
  let fixture: ComponentFixture<ListIssuedPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListIssuedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
