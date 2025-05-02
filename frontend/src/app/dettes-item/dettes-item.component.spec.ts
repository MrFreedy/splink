import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettesItemComponent } from './dettes-item.component';

describe('DettesItemComponent', () => {
  let component: DettesItemComponent;
  let fixture: ComponentFixture<DettesItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DettesItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DettesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
