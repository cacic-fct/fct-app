import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageCertificatesPage } from './manage-certificates.page';

describe('ManageCertificatesPage', () => {
  let component: ManageCertificatesPage;
  let fixture: ComponentFixture<ManageCertificatesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ManageCertificatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
