import {
  DestroyRef,
  Directive,
  ElementRef,
   OnInit,
  Renderer2,
  effect,
  inject,
  input,
} from '@angular/core';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnInit {
  readonly appTooltip = input.required<string>();
  readonly tooltipPosition = input<TooltipPosition>('top');

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);

  private bubbleEl: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const text = this.appTooltip();
      const pos = this.tooltipPosition();
      if (this.bubbleEl) {
        this.bubbleEl.textContent = text;
        this.updatePositionClass(pos);
      }
    });
  }

  ngOnInit(): void {
    const host = this.el.nativeElement;
    this.renderer.addClass(host, 'app-tooltip-host');

    const bubble = this.renderer.createElement('span') as HTMLElement;
    this.renderer.addClass(bubble, 'app-tooltip');
    this.renderer.addClass(bubble, `app-tooltip--${this.tooltipPosition()}`);
    this.renderer.setAttribute(bubble, 'role', 'tooltip');
    this.renderer.setAttribute(bubble, 'aria-hidden', 'true');
    bubble.textContent = this.appTooltip();

    this.renderer.appendChild(host, bubble);
    this.bubbleEl = bubble;

    const show = () => {
      if (this.bubbleEl && this.appTooltip().trim().length > 0) {
        this.renderer.addClass(this.bubbleEl, 'app-tooltip--visible');
      }
    };

    const hide = () => {
      if (this.bubbleEl) {
        this.renderer.removeClass(this.bubbleEl, 'app-tooltip--visible');
      }
    };

    const unlistenEnter = this.renderer.listen(host, 'mouseenter', show);
    const unlistenLeave = this.renderer.listen(host, 'mouseleave', hide);
    const unlistenFocus = this.renderer.listen(host, 'focusin', show);
    const unlistenBlur = this.renderer.listen(host, 'focusout', hide);
    const unlistenClick = this.renderer.listen(host, 'click', hide);

    this.destroyRef.onDestroy(() => {
      unlistenEnter();
      unlistenLeave();
      unlistenFocus();
      unlistenBlur();
      unlistenClick();
      if (this.bubbleEl && this.bubbleEl.parentNode === host) {
        this.renderer.removeChild(host, this.bubbleEl);
      }
      this.bubbleEl = null;
    });
  }

  private updatePositionClass(position: TooltipPosition): void {
    if (!this.bubbleEl) {
      return;
    }
    const positions: TooltipPosition[] = ['top', 'bottom', 'left', 'right'];
    for (const pos of positions) {
      this.renderer.removeClass(this.bubbleEl, `app-tooltip--${pos}`);
    }
    this.renderer.addClass(this.bubbleEl, `app-tooltip--${position}`);
  }
}

