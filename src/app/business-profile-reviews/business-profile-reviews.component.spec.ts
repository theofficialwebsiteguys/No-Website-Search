import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessProfileReviewsComponent } from './business-profile-reviews.component';

describe('BusinessProfileReviewsComponent', () => {
  let component: BusinessProfileReviewsComponent;
  let fixture: ComponentFixture<BusinessProfileReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessProfileReviewsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusinessProfileReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
