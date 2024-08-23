import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-business-profile-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './business-profile-reviews.component.html',
  styleUrl: './business-profile-reviews.component.scss'
})
export class BusinessProfileReviewsComponent {
  @Input() business: any;
}
