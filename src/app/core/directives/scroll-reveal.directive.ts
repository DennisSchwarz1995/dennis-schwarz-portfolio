import {
  DestroyRef,
  Directive,
  ElementRef,
  NgZone,
  afterNextRender,
  inject,
  input,
} from '@angular/core';

export type RevealVariant = 'fade-up' | 'fade-in' | 'scale-in' | 'line';

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class ScrollRevealDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  readonly appReveal = input<RevealVariant | ''>('fade-up');
  readonly revealDelay = input<number>(0);
  readonly revealDistance = input<number>(20);

  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      this.setupObserver();
    });

    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
    });
  }

  private setupObserver(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const element = this.el.nativeElement;

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof IntersectionObserver === 'undefined'
    ) {
      element.classList.add('reveal-visible');
      return;
    }

    const variant: RevealVariant = this.appReveal() || 'fade-up';
    element.classList.add('reveal-init');

    if (variant === 'scale-in') {
      element.classList.add('reveal-init--scale');
    } else if (variant === 'fade-in') {
      element.classList.add('reveal-init--fade');
    } else if (variant === 'line') {
      element.classList.add('reveal-init--line');
    }

    const delay = this.revealDelay();
    if (delay > 0) {
      element.style.setProperty('--reveal-delay', `${delay}s`);
    }

    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              element.classList.add('reveal-visible');
              this.observer?.unobserve(element);
            }
          }
        },
        {
          threshold: 0.12,
          rootMargin: '0px 0px -40px 0px',
        },
      );

      this.observer.observe(element);
    });
  }
}
