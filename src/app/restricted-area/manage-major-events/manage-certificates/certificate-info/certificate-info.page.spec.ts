import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificateInfoPage } from './certificate-info.page';

describe('CertificateInfoPage', () => {
  let component: CertificateInfoPage;
  let fixture: ComponentFixture<CertificateInfoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CertificateInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
