import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepenseItemComponent } from './depense-item.component';

describe('DepenseItemComponent', () => {
  let component: DepenseItemComponent;
  let fixture: ComponentFixture<DepenseItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepenseItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepenseItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
