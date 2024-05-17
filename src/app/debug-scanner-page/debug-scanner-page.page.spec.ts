import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugScannerPagePage } from './debug-scanner-page.page';

describe('DebugScannerPagePage', () => {
  let component: DebugScannerPagePage;
  let fixture: ComponentFixture<DebugScannerPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugScannerPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
