import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColocationLayoutComponent } from './colocation-layout.component';

describe('ColocationLayoutComponent', () => {
  let component: ColocationLayoutComponent;
  let fixture: ComponentFixture<ColocationLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColocationLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColocationLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
