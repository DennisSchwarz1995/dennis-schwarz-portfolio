import {
  DestroyRef,
  Directive,
  ElementRef,
  NgZone,
  OnInit,
  Renderer2,
  afterNextRender,
  inject,
  input,
} from '@angular/core';

export type RevealVariant = 'fade-up' | 'fade-in' | 'scale-in' | 'line';

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  readonly appReveal = input<RevealVariant | ''>('fade-up');
  readonly revealDelay = input<number>(0);
  readonly revealDistance = input<number>(32);

  private observer?: IntersectionObserver;
  private settleTimer: ReturnType<typeof setTimeout> | null = null;
  private rafId: number | null = null;

  constructor() {
    afterNextRender(() => {
      this.setupObserver();
    });

    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
      if (this.settleTimer) {
        clearTimeout(this.settleTimer);
      }
      if (this.rafId !== null && typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(this.rafId);
      }
    });
  }

  ngOnInit(): void {
    const element = this.el.nativeElement;
    const variant: RevealVariant = this.appReveal() || 'fade-up';

    // Apply initial hidden state before first paint so the browser commits the starting frame
    this.renderer.addClass(element, 'reveal-init');

    if (variant === 'scale-in') {
      this.renderer.addClass(element, 'reveal-init--scale');
    } else if (variant === 'fade-in') {
      this.renderer.addClass(element, 'reveal-init--fade');
    } else if (variant === 'line') {
      this.renderer.addClass(element, 'reveal-init--line');
    }

    const delay = this.revealDelay();
    if (delay > 0) {
      element.style.setProperty('--reveal-delay', `${delay}s`);
    }

    const distance = this.revealDistance();
    if (distance !== 32) {
      element.style.setProperty('--reveal-distance', `${distance}px`);
    }
  }

  private setupObserver(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const element = this.el.nativeElement;

    if (typeof IntersectionObserver === 'undefined') {
      element.classList.add('reveal-visible', 'reveal-settled');
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      // Wait one animation frame so the initial .reveal-init style is guaranteed to be painted
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null;
        this.observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                element.classList.add('reveal-visible');
                this.observer?.unobserve(element);

                const delayMs = Math.max(0, this.revealDelay() * 1000);
                this.settleTimer = setTimeout(() => {
                  element.classList.add('reveal-settled');
                  this.settleTimer = null;
                }, 900 + delayMs);
              }
            }
          },
          {
            threshold: 0.12,
            rootMargin: '0px 0px -48px 0px',
          },
        );

        this.observer.observe(element);
      });
    });
  }
}
