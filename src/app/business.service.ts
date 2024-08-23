import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private business: any = {
    name: '',
    phone: '',
    address: '',
    logo: '',
    hero_image: '',
    hero_title: 'Welcome to ',
    banner: '',
    photos: [],
    colors: {
      primary: '#000000', // default color
      secondary: '#ffffff' // default color
    }
  };

  private searchResults: any[] = [];

  getBusiness() {
    return this.business;
  }

  updateBusiness(data: any) {
    this.business = { ...this.business, ...data };
  }

  getSearchResults() {
    return this.searchResults;
  }

  updateSearchResults(results: any[]) {
    this.searchResults = results;
  }
}
