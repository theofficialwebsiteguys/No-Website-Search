import { Component, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { GoogleMapsService } from '../google-maps.service';
import { forkJoin, from, Observable } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, NavigationExtras } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BusinessService } from '../business.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule]
})
export class MapComponent implements OnInit, AfterViewInit {
  @Output() radiusChanged = new EventEmitter<number>();
  @Output() centerChanged = new EventEmitter<{ lat: number, lng: number }>();
  @Output() mapInitialized = new EventEmitter<void>();

  map!: google.maps.Map;
  circle!: google.maps.Circle;
  radius: number = 3000; // Default radius in meters
  center: { lat: number, lng: number } = { lat: 42.408513412792566, lng: -71.05311593977181 }; // Default center
  types: string[] = ['restaurant']; // Predefined business types
  mapInitializedFlag: boolean = false;
  query: string = ''; // Placeholder for query

  searchResults: any[] = [];
  noResultsFound: boolean = false;
  error_search: string = '';
  emailMode: boolean = false; // Toggle for email mode

  constructor(
    private googleMapsService: GoogleMapsService,
    private router: Router,
    private businessService: BusinessService
  ) {
    // Load any pre-existing search results from the service
    this.searchResults = this.businessService.getSearchResults();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.loadMap();
    this.setCurrentLocation();
  }

  loadMap(): void {
    const mapOptions: google.maps.MapOptions = {
      center: this.center,
      zoom: 12
    };

    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);

    this.circle = new google.maps.Circle({
      map: this.map,
      radius: this.radius,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      center: this.center,
      editable: true,
      draggable: true
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      // Emit event after the map and circle have been initialized
      this.mapInitialized.emit();
      this.mapInitializedFlag = true; // Set the flag here
    });
  }

  setCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.map.setCenter(this.center);
          this.circle.setCenter(this.center);
          this.centerChanged.emit(this.center);
        },
        (error) => {
          console.error('Error getting current location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  onRadiusChanged(newRadius: number): void {
    this.radius = newRadius;
    this.updateCircle();
  }

  onCenterChanged(newCenter: { lat: number, lng: number }): void {
    this.center = newCenter;
    this.updateCircle();
  }

  toggleSearchMode(): void {
    this.emailMode = !this.emailMode;
    if (this.emailMode) {
      this.types = ['doctor', 'dentist', 'lawyer', 'real_estate_agency'];
    } else {
      this.types = ['restaurant'];
    }
  }

  search(): void {
    if (!this.mapInitializedFlag) {
      console.error('Map component is not fully initialized.');
      return;
    }

    const center = this.getCircleCenter();
    const radius = this.getCircleRadius();
    if (!center) {
      console.error('Circle center is not defined.');
      return;
    }

    const searchObservables: Observable<any>[] = this.types.map(type =>
      this.googleMapsService.searchPlaces(center.lat(), center.lng(), radius, [type])
    );

    from(searchObservables)
      .pipe(
        mergeMap(obs => obs),
        mergeMap((initialPlaces: any[]) =>
          forkJoin(
            initialPlaces
              .filter(place => place.business_status === 'OPERATIONAL')
              .map(place => {
                return this.googleMapsService.getPlaceDetails(place.place_id).pipe(
                  map(details => ({
                    name: details.name,
                    phone: details.formatted_phone_number,
                    address: place.vicinity, // Feed forward the vicinity as address
                    website: details.website, // Include website for filtering
                    hasWebsite: !!details.website // New field to indicate if there is a website
                  }))
                );
              })
          )
        ),
        toArray()
      )
      .subscribe(
        results => {
          this.searchResults = results.flat();
          this.businessService.updateSearchResults(this.searchResults); // Save the results in the service
          this.noResultsFound = false;
          // Sort results to move those without websites to the top
          this.searchResults.sort((a, b) => a.hasWebsite === b.hasWebsite ? 0 : a.hasWebsite ? 1 : -1);
          if (this.searchResults.length === 0) {
            this.noResultsFound = true;
            this.error_search = this.query;
          }
        },
        error => {
          console.error('Error during search:', error);
        }
      );
  }

  removePlace(placeIndex: number): void {
    this.searchResults.splice(placeIndex, 1);
    this.businessService.updateSearchResults(this.searchResults); // Update the service
  }

  updateCircle(): void {
    if (this.circle) {
      this.circle.setRadius(this.radius);
      this.circle.setCenter(this.center);
      this.map.setCenter(this.center);
      this.radiusChanged.emit(this.radius);
      this.centerChanged.emit(this.center);
    }
  }

  getCircleCenter(): google.maps.LatLng | null {
    return this.circle ? this.circle.getCenter() : null;
  }

  getCircleRadius(): number {
    return this.circle ? this.circle.getRadius() : 0;
  }

  clearResults(): void {
    this.searchResults = [];
    this.noResultsFound = false;
    this.businessService.updateSearchResults(this.searchResults); // Clear the results in the service
  }

  selectBusiness(place: any): void {
    this.businessService.updateBusiness(place); // Save the selected business
    const navigationExtras: NavigationExtras = {
      state: {
        searchResults: this.searchResults
      }
    };
    this.router.navigate(['/business-details'], navigationExtras);
  }

  searchOnGoogle(businessName: string): void {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(businessName)}`;
    window.open(searchUrl, '_blank');
  }
}
