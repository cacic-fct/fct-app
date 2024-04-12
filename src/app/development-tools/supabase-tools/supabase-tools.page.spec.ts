import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupabaseToolsPage } from './supabase-tools.page';

describe('SupabaseToolsPage', () => {
  let component: SupabaseToolsPage;
  let fixture: ComponentFixture<SupabaseToolsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SupabaseToolsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
