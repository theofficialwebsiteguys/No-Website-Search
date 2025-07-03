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

  fallbackHeroImage = 'https://source.unsplash.com/1600x900/?restaurant,dining';

reviews = [
  {
    author: 'Emily',
    stars: '★★★★★',
    text: 'Would give Fiesta Bowl more than 5 stars if possible! This is such a fun Mexican restaurant!!! Drinks are awesome - trying the margarita flight at least once is a must!!! Chips and salsa are good and the guacamole is also really good. All of the food I\'ve tried has been delicious too. I always have so much fun coming here and it is a really fun environment.'
  },
  {
    author: 'John',
    stars: '★★★★☆',
    text: 'Great place for Mexican food. The atmosphere is vibrant and the staff is friendly. The food is consistently good and the drinks are excellent. Definitely a place to visit again and again.'
  },
  {
    author: 'Sarah',
    stars: '★★★★★',
    text: 'Amazing food and great service! The margaritas are top-notch, and the tacos are the best I\'ve ever had. Highly recommend this place for a fun night out.'
  }
];

}
