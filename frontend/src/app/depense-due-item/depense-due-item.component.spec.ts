import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepenseDueItemComponent } from './depense-due-item.component';

describe('DepenseDueItemComponent', () => {
  let component: DepenseDueItemComponent;
  let fixture: ComponentFixture<DepenseDueItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepenseDueItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepenseDueItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
