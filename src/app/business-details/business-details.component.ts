import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleMapsService } from '../google-maps.service';
import { BusinessService } from '../business.service';

@Component({
  selector: 'app-business-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.scss']
})
export class BusinessDetailsComponent implements OnInit {
  business: any;
  currentStep = 1;
  searchResults: any[] = [];
  fetchedPhotos: any[] = []; // To store fetched photos

  constructor(private router: Router, private googleMapsService: GoogleMapsService, private businessService: BusinessService) {
    this.business = this.businessService.getBusiness();
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['searchResults']) {
      this.searchResults = navigation.extras.state['searchResults'];
    }

    // Restore the last saved step
    this.restoreLastStep();
  }

  ngOnInit(): void {}

  restoreLastStep(): void {
    if (this.business.name) {
      this.currentStep = 2;
      this.fetchPhotos(); // Fetch photos when business name is set
    }
    if (this.business.phone) this.currentStep = 3;
    if (this.business.address) this.currentStep = 4;
    if (this.business.logo) this.currentStep = 5;
    if (this.business.hero_image) this.currentStep = 6;
    if (this.business.photos.length > 0) this.currentStep = 9;
  }

  fetchPhotos(): void {
    if (this.business.name) {
      this.googleMapsService.searchPhotos(this.business.name).subscribe(photos => {
        this.fetchedPhotos = photos;
      });
    }
  }

  onLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.business.logo = e.target.result; // This will be a base64 string
        this.businessService.updateBusiness({ logo: this.business.logo });
        this.nextStep(5);
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
        this.businessService.updateBusiness({ hero_image: this.business.hero_image });
        this.nextStep(6);
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
        this.businessService.updateBusiness({ photos: this.business.photos });
      };
      reader.readAsDataURL(files[i]);
    }
    this.nextStep(9);
  }

  addFetchedPhoto(photoUrl: string): void {
    if (this.business.photos.length < 8) {
      this.business.photos.push(photoUrl);
      this.businessService.updateBusiness({ photos: this.business.photos });
    }
  }

  nextStep(step: number): void {
    this.currentStep = step;
  }

  previousStep(): void {
    this.currentStep = this.currentStep > 1 ? this.currentStep - 1 : 1;
  }

  submitDetails(): void {
    this.businessService.updateBusiness(this.business);
    this.router.navigate(['/business-profile']);
  }

  goBack(): void {
    this.router.navigate(['/'], { state: { searchResults: this.searchResults } });
  }
}
