import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './business-details.component.html',
  styleUrl: './business-details.component.scss'
})
export class BusinessDetailsComponent implements OnInit {
  business: any = {
    name: '',
    phone: '',
    address: '',
    logo: '',
    hero_image: '',
    hero_title: '',
    photos: [],
    colors: {
      primary: '#000000', // default color
      secondary: '#ffffff' // default color
    }
  };

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['business']) {
      this.business = navigation.extras.state['business'];
      // Ensure colors are initialized if not present
      this.business.colors = this.business.colors || { primary: '#000000', secondary: '#ffffff' };
    }
  }

  ngOnInit(): void {}

  onLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.business.logo = e.target.result; // This will be a base64 string
      };
      reader.readAsDataURL(file);
    }
  }

  onHeroSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.business.hero_image = e.target.result; // This will be a base64 string
      };
      reader.readAsDataURL(file);
    }
  }

  onPhotosSelected(event: any): void {
    const files = event.target.files;
    this.business.photos = []; // Clear existing photos
    for (let i = 0; i < files.length && i < 8; i++) { // Limit to 8 photos
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.business.photos.push(e.target.result); // Add each photo as a base64 string
      };
      reader.readAsDataURL(files[i]);
    }
  }

  submitDetails(): void {
    this.router.navigate(['/business-profile'], { state: { business: this.business } });
  }
}
