import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvoirsItemComponent } from './avoirs-item.component';

describe('AvoirsItemComponent', () => {
  let component: AvoirsItemComponent;
  let fixture: ComponentFixture<AvoirsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvoirsItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvoirsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
