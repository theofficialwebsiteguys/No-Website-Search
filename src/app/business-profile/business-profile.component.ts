import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BusinessService } from '../business.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BusinessProfileHeaderComponent } from '../business-profile-header/business-profile-header.component';
import { BusinessProfileReviewsComponent } from '../business-profile-reviews/business-profile-reviews.component';

interface DropdownMenu {
  id: string;
  title: string;
  items: { link: string, label: string }[];
  active: boolean;
}

@Component({
  selector: 'app-business-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, BusinessProfileHeaderComponent, BusinessProfileReviewsComponent],
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.scss']
})
export class BusinessProfileComponent {
  business: any;
  safeMapUrl!: SafeResourceUrl;

  constructor(private router: Router, private sanitizer: DomSanitizer, private renderer: Renderer2, private businessService: BusinessService) {
    this.business = this.businessService.getBusiness();
    this.updateSafeMapUrl();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // window.addEventListener('scroll', this.onWindowScroll.bind(this));
    window.scrollTo(0, 0); // Scroll to the top of the page
  }

  private updateSafeMapUrl(): void {
    if (this.business.address) {
      const baseUrl = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyAo8ug8MO95hKXN00mgBedWiQc2cQVhyzU&q=';
      const query = encodeURIComponent(this.business.address);
      const url = `${baseUrl}${query}`;
      this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

  @ViewChild('navbar') navbar!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;

  searchBarVisible = false;
  mobileMenuActive = false;

  dropdownMenus: DropdownMenu[] = [
    {
      id: 'menu',
      title: 'Menu',
      items: [],
      active: false
    },
    {
      id: 'catering',
      title: 'Catering',
      items: [],
      active: false
    }
  ];

  goBack(): void {
    const navigationExtras = {
      state: {
        business: this.businessService.getBusiness(),
        searchResults: this.businessService.getSearchResults()
      }
    };
    this.router.navigate(['/business-details'], navigationExtras);
  }

  closeMenu() {
    this.mobileMenuActive = false;
    this.dropdownMenus.forEach(menu => menu.active = false);
  }

  toggleMobileMenu() {
    this.mobileMenuActive = !this.mobileMenuActive;
  }

  toggleSearchBar() {
    this.closeMenu();
    this.searchBarVisible = !this.searchBarVisible;
    const searchBarContainer = document.getElementById('searchBarContainer');
    if (searchBarContainer) {
      searchBarContainer.style.display = this.searchBarVisible ? 'block' : 'none';
      if (this.searchBarVisible) {
        setTimeout(() => {
          this.searchInput.nativeElement.focus();
        }, 0);
      }
    }
  }

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    // Implement your search logic here
  }

  onSearchEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const query = (event.target as HTMLInputElement).value;
      if (query) {
        this.router.navigate(['/search-results'], { queryParams: { query } });
        this.closeSearchBar();
      }
    }
  }

  viewProductDetail(product: any): void {
    this.searchBarVisible = false;
    const searchBarContainer = document.getElementById('searchBarContainer');
    if (searchBarContainer) {
      searchBarContainer.style.display = 'none';
    }
    this.router.navigate(['/item', product.id], { state: { product } });
  }

  closeSearchBar() {
    this.searchBarVisible = false;
    const searchBarContainer = document.getElementById('searchBarContainer');
    if (searchBarContainer) {
      searchBarContainer.style.display = 'none';
    }
  }

  toggleDropdown(dropdownId: string) {
    const dropdownMenu = this.dropdownMenus.find(menu => menu.id === dropdownId);
    if (dropdownMenu) {
      dropdownMenu.active = !dropdownMenu.active;
    }
  }

  handleDropdownClick(event: Event, dropdownId: string) {
    event.preventDefault();
    event.stopPropagation();
    const dropdownElement = document.getElementById(dropdownId);
    if (dropdownElement) {
      const isShown = dropdownElement.classList.contains('show');
      this.closeAllDropdowns();
      if (!isShown) {
        this.renderer.addClass(dropdownElement, 'show');
      }
    }
  }

  closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    dropdowns.forEach(dropdown => {
      this.renderer.removeClass(dropdown, 'show');
    });
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event) {
    if (!this.isClickInsideElement(event, 'dropdown-toggle') && !this.isClickInsideElement(event, 'dropdown-menu')) {
      this.closeAllDropdowns();
    }
  }

  isClickInsideElement(event: Event, className: string): boolean {
    return (event.target as HTMLElement).closest(`.${className}`) !== null;
  }

  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   const offset = window.pageYOffset;
  //   if (offset > 50) {
  //     this.renderer.addClass(this.navbar.nativeElement, 'scrolled');
  //   } else {
  //     this.renderer.removeClass(this.navbar.nativeElement, 'scrolled');
  //   }
  // }
}
