import { AgmCoreModule } from '@agm/core';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loader } from "@googlemaps/js-api-loader"
import { SearchPlacesComponent } from './search-places/search-places.component';
import { MapComponent } from './map/map.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, RouterOutlet, SearchPlacesComponent, MapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{

  
}
