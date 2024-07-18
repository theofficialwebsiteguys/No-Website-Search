import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BusinessDetailsComponent } from './business-details/business-details.component';
import { MapComponent } from './map/map.component';
import { BusinessProfileComponent } from './business-profile/business-profile.component';

export const routes: Routes = [
  { path: 'business-details', component: BusinessDetailsComponent },
  { path: 'business-profile', component: BusinessProfileComponent },
  { path: '', component: MapComponent },
  { path: '**', redirectTo: '/business-details' }
  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }