import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SmoothScrollService {
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);

  init(): void {
    // Native compositor-threaded scrolling is handled via CSS (scroll-behavior: smooth)
    // to eliminate main-thread jank and GPU tile flickering.
  }

  async navigateToSection(sectionId: string): Promise<void> {
    const currentPath = this.router.url.split('?')[0].split('#')[0];
    if (currentPath !== '/' && currentPath !== '') {
      await this.router.navigateByUrl('/');
      setTimeout(() => this.scrollToElement(sectionId), 80);
      return;
    }
    this.scrollToElement(sectionId);
  }

  scrollToTop(immediate = false): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
    }
  }

  setScrollLocked(locked: boolean): void {
    if (this.doc?.body) {
      this.doc.body.style.overflow = locked ? 'hidden' : '';
    }
  }

  destroy(): void {}

  private scrollToElement(sectionId: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    const target = this.doc.getElementById(sectionId);
    if (!target) {
      return;
    }
    const headerOffset = 76;
    const elementTop = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: Math.max(0, elementTop - headerOffset),
      behavior: 'smooth',
    });
  }
}
