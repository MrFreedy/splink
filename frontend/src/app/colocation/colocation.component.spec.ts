import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColocationComponent } from './colocation.component';

describe('ColocationComponent', () => {
  let component: ColocationComponent;
  let fixture: ComponentFixture<ColocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
