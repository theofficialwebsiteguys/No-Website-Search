import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { GoogleMapsService } from '../google-maps.service';
import { forkJoin } from 'rxjs';
import { MapComponent } from '../map/map.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

export interface SearchResult {
  query: string;
  places: any[];
}

@Component({
  selector: 'app-search-places',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MapComponent],
  templateUrl: './search-places.component.html',
  styleUrls: ['./search-places.component.scss']
})
export class SearchPlacesComponent implements OnInit, AfterViewInit {
  @ViewChild(MapComponent) mapComponent!: MapComponent;

  searchResults: SearchResult[] = [];
  noResultsFound: boolean = false;
  error_search: string = '';
  radius: number = 5000; // Default radius in meters
  center: { lat: number, lng: number } = { lat: 51.678418, lng: 7.809007 }; // Default center
  types: string[] = []; // Selected types
  mapInitialized: boolean = false;

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
    this.mapComponent.mapInitialized.subscribe(() => {
      this.mapInitialized = true;
    });
  }

  onRadiusChanged(newRadius: number): void {
    this.radius = newRadius;
  }

  onCenterChanged(newCenter: { lat: number, lng: number }): void {
    this.center = newCenter;
  }

  search(): void {
    if (!this.mapInitialized) {
      console.error('Map component is not fully initialized.');
      return;
    }

    const center = this.mapComponent.getCircleCenter();
    const radius = this.mapComponent.getCircleRadius();
    if (!center) {
      console.error('Circle center is not defined.');
      return;
    }

    this.googleMapsService.searchPlaces(center.lat(), center.lng(), radius, this.types).subscribe(initialPlaces => {
      this.noResultsFound = false;
      if (initialPlaces.length === 0) {
        return;
      }
      const detailObservables = initialPlaces.map(place =>
        this.googleMapsService.getPlaceDetails(place.place_id)
      );

      forkJoin(detailObservables).subscribe(details => {
        const placesWithDetails = details.filter(detail => detail.website).map(detail => ({
          name: detail.name,
          place_id: detail.place_id,
          phone: detail.formatted_phone_number
        }));

        if (placesWithDetails.length > 0) {
          this.searchResults.push({ query: `Search within ${radius} meters`, places: placesWithDetails });
        } else {
          this.error_search = `Search within ${radius} meters`;
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
}
