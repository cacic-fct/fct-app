import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugScannerPage } from './debug-scanner.page';

describe('DebugScannerPage', () => {
  let component: DebugScannerPage;
  let fixture: ComponentFixture<DebugScannerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugScannerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
