import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ScrollRevealDirective } from '../../../../core/directives/scroll-reveal.directive';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';
import { ContactService } from '../../../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, ScrollRevealDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly destroyRef = inject(DestroyRef);

  readonly submitState = signal<'idle' | 'submitting' | 'success' | 'error'>('idle');
  readonly isInputsHighlighted = signal(false);

  private highlightTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const seq = this.contactService.highlightSequence();
      if (seq > 0) {
        this.playInputHighlight();
      }
    });

    this.destroyRef.onDestroy(() => {
      if (this.highlightTimer) {
        clearTimeout(this.highlightTimer);
      }
    });
  }

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
      ],
    ],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
    privacyAccepted: [false, [Validators.requiredTrue]],
    website: [''], // Honeypot field against spam bots
  });

  hasFieldError(controlName: 'name' | 'email' | 'message' | 'privacyAccepted'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  private playInputHighlight(): void {
    if (this.highlightTimer) {
      clearTimeout(this.highlightTimer);
      this.highlightTimer = null;
    }

    // Reset briefly so repeated clicks reliably restart the CSS keyframe animation
    this.isInputsHighlighted.set(false);
    setTimeout(() => {
      this.isInputsHighlighted.set(true);
      this.highlightTimer = setTimeout(() => {
        this.isInputsHighlighted.set(false);
        this.highlightTimer = null;
      }, 1750);
    }, 20);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.submitState() === 'submitting') {
      return;
    }

    this.submitState.set('submitting');
    const raw = this.form.getRawValue();

    this.contactService
      .sendMessage({
        name: raw.name.trim(),
        email: raw.email.trim(),
        message: raw.message.trim(),
        privacyAccepted: raw.privacyAccepted,
        website: raw.website,
      })
      .pipe(
        finalize(() => {
          if (this.submitState() === 'submitting') {
            this.submitState.set('idle');
          }
        }),
      )
      .subscribe({
        next: () => {
          this.submitState.set('success');
          this.form.reset({
            name: '',
            email: '',
            message: '',
            privacyAccepted: false,
            website: '',
          });
        },
        error: () => {
          this.submitState.set('error');
        },
      });
  }
}

