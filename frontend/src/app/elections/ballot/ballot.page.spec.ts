import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BallotPage } from './ballot.page';

describe('BallotPage', () => {
  let component: BallotPage;
  let fixture: ComponentFixture<BallotPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
