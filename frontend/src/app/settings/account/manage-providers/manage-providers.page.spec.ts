import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageProvidersPage } from './manage-providers.page';

describe('ManageProvidersPage', () => {
  let component: ManageProvidersPage;
  let fixture: ComponentFixture<ManageProvidersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProvidersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
