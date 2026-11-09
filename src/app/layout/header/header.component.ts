import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  NgZone,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { SupportedLang } from '../../core/models/portfolio.models';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { I18nService } from '../../core/services/i18n.service';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly i18n = inject(I18nService);
  private readonly smoothScroll = inject(SmoothScrollService);
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  readonly isScrolled = signal(false);
  readonly isMobileMenuOpen = signal(false);

  readonly navItems = [
    { id: 'about', labelKey: 'ABOUT_ME' },
    { id: 'projects', labelKey: 'PROJECTS' },
    { id: 'skills', labelKey: 'SKILLS' },
    { id: 'testimonials', labelKey: 'REFERENCES_NAV' },
    { id: 'contact', labelKey: 'CONTACT_NAV' },
  ] as const;

  constructor() {
    afterNextRender(() => {
      this.ngZone.runOutsideAngular(() => {
        const onScroll = () => {
          const scrolled = window.scrollY > 28;
          if (scrolled !== this.isScrolled()) {
            this.ngZone.run(() => this.isScrolled.set(scrolled));
          }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
      });
    });
  }

  selectLanguage(lang: SupportedLang): void {
    this.i18n.setLanguage(lang);
  }

  navigate(sectionId: string): void {
    if (this.isMobileMenuOpen()) {
      this.closeMobileMenu();
    }
    void this.smoothScroll.navigateToSection(sectionId);
  }

  goHome(): void {
    if (this.isMobileMenuOpen()) {
      this.closeMobileMenu();
    }
    void this.smoothScroll.navigateToSection('hero');
  }

  toggleMobileMenu(): void {
    const next = !this.isMobileMenuOpen();
    this.isMobileMenuOpen.set(next);
    this.smoothScroll.setScrollLocked(next);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
    this.smoothScroll.setScrollLocked(false);
  }
}

