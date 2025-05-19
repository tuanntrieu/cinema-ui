import { Component, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { LayoutService } from '../../services/layout/layout.service';
import { MenuService } from '../../services/layout/menu.service';
import { AppSidebarComponent } from '../../components/admin/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from '../../components/admin/topbar/topbar.component';
import { FooterComponent } from '../../components/admin/footer/footer.component';
import { NgxSpinnerModule } from 'ngx-spinner';


@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [RouterOutlet, AppSidebarComponent,
         CommonModule, TopbarComponent, FooterComponent
        ,NgxSpinnerModule],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnDestroy {

    overlayMenuOpenSubscription: Subscription;

    menuOutsideClickListener: any;

    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;

    constructor(private menuService: MenuService, public layoutService: LayoutService, public renderer: Renderer2, public router: Router) {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                    const isOutsideClicked = !(this.appSidebar.el.nativeElement.isSameNode(event.target) || this.appSidebar.el.nativeElement.contains(event.target)
                        || event.target.classList.contains('p-trigger') || event.target.parentNode.classList.contains('p-trigger'));

                    if (isOutsideClicked) {
                        this.layoutService.state.profileSidebarVisible = false;
                        this.layoutService.state.overlayMenuActive = false;
                        this.layoutService.state.staticMenuMobileActive = false;
                        this.layoutService.state.menuHoverActive = false;
                        this.menuService.reset();
                        this.menuOutsideClickListener();
                        this.menuOutsideClickListener = null;
                        this.unblockBodyScroll();
                    }
                    else {
                        if (this.layoutService.state.staticMenuMobileActive) {
                            this.blockBodyScroll();
                        }
                    }
                });
            }
        });

        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.unblockBodyScroll();
            });
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        }
        else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        }
        else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
                'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    get containerClass() {
        return {
            'layout-theme-light': this.layoutService.config.colorScheme === 'light',
            'layout-theme-dark': this.layoutService.config.colorScheme === 'dark',
            'layout-overlay': this.layoutService.config.menuMode === 'overlay',
            'layout-static': this.layoutService.config.menuMode === 'static',
            'layout-slim': this.layoutService.config.menuMode === 'slim',
            'layout-horizontal': this.layoutService.config.menuMode === 'horizontal',
            'layout-static-inactive': this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config.menuMode === 'static',
            'layout-overlay-active': this.layoutService.state.overlayMenuActive,
            'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
            'p-input-filled': this.layoutService.config.inputStyle === 'filled',
            'p-ripple-disabled': !this.layoutService.config.ripple
        }
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }
}
