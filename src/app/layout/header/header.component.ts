import { DOCUMENT } from '@angular/common';
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
import { ContactService } from '../../core/services/contact.service';
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
  private readonly contactService = inject(ContactService);
  private readonly doc = inject(DOCUMENT);
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  readonly isScrolled = signal(false);
  readonly isMobileMenuOpen = signal(false);
  readonly activeSection = signal<string>('');

  readonly navItems = [
    { id: 'about', labelKey: 'ABOUT_ME' },
    { id: 'projects', labelKey: 'PROJECTS' },
    { id: 'skills', labelKey: 'SKILLS' },
    { id: 'testimonials', labelKey: 'REFERENCES_NAV' },
    { id: 'contact', labelKey: 'CONTACT_NAV' },
  ] as const;

  private highlightDelayTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    afterNextRender(() => {
      this.ngZone.runOutsideAngular(() => {
        const onScroll = () => {
          const scrollY = window.scrollY;
          const scrolled = scrollY > 28;
          const currentActive = this.resolveActiveSection(scrollY);

          if (scrolled !== this.isScrolled() || currentActive !== this.activeSection()) {
            this.ngZone.run(() => {
              this.isScrolled.set(scrolled);
              this.activeSection.set(currentActive);
            });
          }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        this.destroyRef.onDestroy(() => {
          window.removeEventListener('scroll', onScroll);
          if (this.highlightDelayTimer) {
            clearTimeout(this.highlightDelayTimer);
          }
        });
      });
    });
  }

  onLanguageClick(lang: SupportedLang): void {
    if (this.i18n.lang() === lang) {
      this.i18n.toggleLanguage();
    } else {
      this.i18n.setLanguage(lang);
    }
  }

  navigate(sectionId: string): void {
    if (this.isMobileMenuOpen()) {
      this.closeMobileMenu();
    }
    this.activeSection.set(sectionId);
    void this.smoothScroll.navigateToSection(sectionId);
  }

  goHome(): void {
    if (this.isMobileMenuOpen()) {
      this.closeMobileMenu();
    }
    this.activeSection.set('');
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

  private resolveActiveSection(scrollY: number): string {
    const triggerLine = scrollY + Math.min(260, window.innerHeight * 0.35);

    // Check if the user has scrolled near the very bottom of the document
    const docHeight = this.doc.documentElement.scrollHeight;
    if (window.innerHeight + scrollY >= docHeight - 60) {
      const contactExists = this.doc.getElementById('contact');
      if (contactExists) {
        return 'contact';
      }
    }

    let matched = '';
    for (const item of this.navItems) {
      const el = this.doc.getElementById(item.id);
      if (!el) {
        continue;
      }
      const top = el.getBoundingClientRect().top + scrollY;
      if (triggerLine >= top) {
        matched = item.id;
      }
    }

    return matched;
  }
}
