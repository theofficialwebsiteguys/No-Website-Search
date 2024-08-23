import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  //private serverUrl = 'https://no-website-search-1a6ef1d846b8.herokuapp.com'; // Update with your server's URL
  private serverUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  searchPlaces(lat: number, lng: number, radius: number, types: string[]): Observable<any[]> {
    const typesQuery = types.join(',');
    const url = `${this.serverUrl}/search-places?lat=${lat}&lng=${lng}&radius=${radius}&types=${typesQuery}`;
    return this.http.get<any>(url).pipe(
      map(response => response)
    );
  }

  getPlaceDetails(placeId: string): Observable<any> {
    const url = `${this.serverUrl}/place-details?placeId=${placeId}`;
    return this.http.get<any>(url).pipe(
      map(response => response)
    );
  }

  searchPhotos(businessName: string): Observable<any[]> {
    const url = `${this.serverUrl}/search-photos?businessName=${businessName}`;
    return this.http.get<any>(url).pipe(
      map(response => response.photos || [])
    );
  }
}
