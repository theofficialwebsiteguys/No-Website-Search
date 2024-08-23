import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessProfileHeaderComponent } from './business-profile-header.component';

describe('BusinessProfileHeaderComponent', () => {
  let component: BusinessProfileHeaderComponent;
  let fixture: ComponentFixture<BusinessProfileHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessProfileHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusinessProfileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
