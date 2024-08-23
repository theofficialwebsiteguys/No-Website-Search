import { AgmCoreModule } from '@agm/core';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loader } from "@googlemaps/js-api-loader"
import { MapComponent } from './map/map.component';
import { HttpClientModule } from '@angular/common/http';
import { BusinessDetailsComponent } from './business-details/business-details.component';
import { BusinessProfileComponent } from './business-profile/business-profile.component';
import { BusinessProfileHeaderComponent } from './business-profile-header/business-profile-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, RouterOutlet, MapComponent, BusinessDetailsComponent, BusinessProfileComponent, BusinessProfileHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{

  
}
