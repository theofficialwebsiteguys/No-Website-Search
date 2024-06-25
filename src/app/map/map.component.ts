import { Component, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { GoogleMapsService } from '../google-maps.service';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

export interface SearchResult {
  query: string;
  places: any[];
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule]
})
export class MapComponent implements OnInit, AfterViewInit {
  @Output() radiusChanged = new EventEmitter<number>();
  @Output() centerChanged = new EventEmitter<{ lat: number, lng: number }>();
  @Output() mapInitialized = new EventEmitter<void>();

  map!: google.maps.Map;
  circle!: google.maps.Circle;
  radius: number = 2000; // Default radius in meters
  center: { lat: number, lng: number } = { lat: 42.408513412792566, lng: -71.05311593977181 }; // Default center
  types: string[] = []; // Selected types
  mapInitializedFlag: boolean = false;
  query: string = ''; // Placeholder for query

  searchResults: SearchResult[] = [];
  noResultsFound: boolean = false;
  error_search: string = '';

  businessTypes = [
    { name: 'Restaurant', value: 'restaurant' },
    { name: 'Dentist', value: 'dentist' },
    { name: 'Accountant', value: 'accountant' },
    { name: 'Doctor', value: 'doctor' },
    { name: 'Lawyer', value: 'lawyer' },
    { name: 'Hardscaping', value: 'hardscaping' },
    { name: 'Masonry', value: 'masonry' },
    { name: 'Roofers', value: 'roofers' },
    { name: 'Electricians', value: 'electricians' },
    { name: 'Plumbers', value: 'plumbers' },
    { name: 'Petsitters', value: 'petsitters' },
    { name: 'Country Club', value: 'country_club' },
    { name: 'Construction', value: 'construction' },
    { name: 'Tattoo Shop', value: 'tattoo_shop' }
  ];

  constructor(private googleMapsService: GoogleMapsService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.loadMap();
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

    this.circle.addListener('radius_changed', () => {
      this.radius = this.circle.getRadius();
      this.radiusChanged.emit(this.radius);
    });

    this.circle.addListener('center_changed', () => {
      const center = this.circle.getCenter();
      if (center) {
        this.map.setCenter(center);
        this.centerChanged.emit({ lat: center.lat(), lng: center.lng() });
      }
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      // Emit event after the map and circle have been initialized
      this.mapInitialized.emit();
      this.mapInitializedFlag = true; // Set the flag here
    });
  }

  onRadiusChanged(newRadius: number): void {
    this.radius = newRadius;
  }

  onCenterChanged(newCenter: { lat: number, lng: number }): void {
    this.center = newCenter;
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

    this.googleMapsService.searchPlaces(center.lat(), center.lng(), radius, this.types).subscribe(initialPlaces => {
      this.noResultsFound = false;
      if (initialPlaces.length === 0) {
        this.noResultsFound = true;
        this.error_search = this.query;
        return;
      }

      const detailObservables = initialPlaces.map(place =>
        this.googleMapsService.getPlaceDetails(place.place_id)
      );

      forkJoin(detailObservables).subscribe(details => {
        // Filter out places without a website
        const placesWithDetails = details.filter(detail => !detail.website).map(detail => ({
          name: detail.name,
          place_id: detail.place_id,
          phone: detail.formatted_phone_number
        }));

        if (placesWithDetails.length > 0) {
          this.searchResults.push({ query: this.query, places: placesWithDetails });
        } else {
          this.error_search = this.query;
          this.noResultsFound = true;
        }
      });
    });
  }

  onTypeChange(event: any, type: string): void {
    if (event.target.checked) {
      this.types.push(type);
    } else {
      const index = this.types.indexOf(type);
      if (index > -1) {
        this.types.splice(index, 1);
      }
    }
  }

  removePlace(searchIndex: number, placeIndex: number): void {
    this.searchResults[searchIndex].places.splice(placeIndex, 1);
    if (this.searchResults[searchIndex].places.length === 0) {
      this.searchResults.splice(searchIndex, 1);
    }
  }

  updateCircle(): void {
    if (this.circle) {
      this.circle.setRadius(Number(this.radius));
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
  }
  
}

