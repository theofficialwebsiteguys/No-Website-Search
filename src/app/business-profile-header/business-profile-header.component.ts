import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-business-profile-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './business-profile-header.component.html',
  styleUrl: './business-profile-header.component.scss'
})
export class BusinessProfileHeaderComponent {
  @Input() business: any;
}
