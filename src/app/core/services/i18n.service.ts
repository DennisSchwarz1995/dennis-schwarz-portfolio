import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SupportedLang } from '../models/portfolio.models';

type TranslationDictionary = Record<string, string>;

const STORAGE_KEY = 'lang';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly http = inject(HttpClient);
  private readonly doc = inject(DOCUMENT);

  private readonly dictionaries = signal<Record<SupportedLang, TranslationDictionary>>({
    de: {},
    en: {},
  });

  private readonly currentLang = signal<SupportedLang>(this.resolveInitialLang());

  readonly lang = this.currentLang.asReadonly();
  readonly activeDictionary = computed(() => this.dictionaries()[this.currentLang()] ?? {});

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event: StorageEvent) => {
        if (event.key === STORAGE_KEY && (event.newValue === 'de' || event.newValue === 'en')) {
          this.applyLang(event.newValue, false);
        }
      });
    }
  }

  async init(): Promise<void> {
    try {
      const [de, en] = await Promise.all([
        firstValueFrom(this.http.get<TranslationDictionary>('assets/i18n/de.json')),
        firstValueFrom(this.http.get<TranslationDictionary>('assets/i18n/en.json')),
      ]);
      this.dictionaries.set({ de, en });
    } catch (err) {
      console.error('[I18nService] Failed to load translation bundles:', err);
    }
    this.syncDocumentLang(this.currentLang());
  }

  setLanguage(lang: SupportedLang): void {
    this.applyLang(lang, true);
  }

  toggleLanguage(): void {
    const next: SupportedLang = this.currentLang() === 'de' ? 'en' : 'de';
    this.applyLang(next, true);
  }

  translate(key: string): string {
    const dict = this.activeDictionary();
    return dict[key] ?? key;
  }

  private applyLang(lang: SupportedLang, persist: boolean): void {
    this.currentLang.set(lang);
    this.syncDocumentLang(lang);
    if (persist && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }

  private syncDocumentLang(lang: SupportedLang): void {
    if (this.doc?.documentElement) {
      this.doc.documentElement.lang = lang;
    }
  }

  private resolveInitialLang(): SupportedLang {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'de' || stored === 'en') {
        return stored;
      }
    }
    if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('de')) {
      return 'de';
    }
    return 'de';
  }
}

