import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePostalcodeComponent } from './create-postalcode.component';

describe('CreatePostalcodeComponent', () => {
  let component: CreatePostalcodeComponent;
  let fixture: ComponentFixture<CreatePostalcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePostalcodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePostalcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
