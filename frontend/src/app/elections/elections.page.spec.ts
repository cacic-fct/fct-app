import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElectionsPage } from './elections.page';

describe('ElectionsPage', () => {
  let component: ElectionsPage;
  let fixture: ComponentFixture<ElectionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
