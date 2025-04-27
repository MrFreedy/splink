import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingTaskItemComponent } from './incoming-task-item.component';

describe('IncomingTaskItemComponent', () => {
  let component: IncomingTaskItemComponent;
  let fixture: ComponentFixture<IncomingTaskItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingTaskItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingTaskItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
