import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  private synthesis: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private isInitialized = false;
  private initPromise: Promise<boolean> | null = null;

  constructor() {
    this.initPromise = this.initialize();
  }

  private async initialize(): Promise<boolean> {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return false;
    }

    this.synthesis = window.speechSynthesis;

    // Safari/Mac workaround: voices may not be immediately available
    // Need to wait for voiceschanged event
    await this.waitForVoices();

    this.selectVoice();
    this.isInitialized = true;
    return true;
  }

  private waitForVoices(): Promise<void> {
    return new Promise((resolve) => {
      const voices = this.synthesis?.getVoices();

      // Voices already available (Chrome, Firefox)
      if (voices && voices.length > 0) {
        resolve();
        return;
      }

      // Safari/Mac: need to wait for voiceschanged event
      const handleVoicesChanged = () => {
        this.synthesis?.removeEventListener('voiceschanged', handleVoicesChanged);
        resolve();
      };

      this.synthesis?.addEventListener('voiceschanged', handleVoicesChanged);

      // Fallback timeout in case voiceschanged never fires
      setTimeout(() => {
        this.synthesis?.removeEventListener('voiceschanged', handleVoicesChanged);
        resolve();
      }, 1000);
    });
  }

  private selectVoice(): void {
    if (!this.synthesis) return;

    const voices = this.synthesis.getVoices();
    if (voices.length === 0) return;

    // Prefer English voices, with preference for local/default voices
    const englishVoices = voices.filter(v =>
      v.lang.startsWith('en') && !v.name.includes('Google')
    );

    // Prefer voices that are marked as default or local
    const preferredVoice = englishVoices.find(v => v.default) ||
      englishVoices.find(v => v.localService) ||
      englishVoices[0] ||
      voices.find(v => v.default) ||
      voices[0];

    this.voice = preferredVoice || null;
  }

  async speak(text: string): Promise<void> {
    // Ensure initialization is complete
    if (this.initPromise) {
      await this.initPromise;
    }

    if (!this.synthesis || !this.isInitialized) {
      console.warn('Speech synthesis not available');
      return;
    }

    return new Promise((resolve) => {
      // Safari workaround: cancel any ongoing speech first
      // This also helps "wake up" the synthesis on Safari
      this.synthesis!.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      if (this.voice) {
        utterance.voice = this.voice;
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Track if we've resolved to prevent double resolution
      let resolved = false;
      const safeResolve = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };

      utterance.onend = safeResolve;
      utterance.onerror = (event) => {
        // Don't log 'interrupted' errors as they're expected when canceling
        if (event.error !== 'interrupted') {
          console.warn('Speech error:', event.error);
        }
        safeResolve();
      };

      // Safari/Mac workaround: sometimes events don't fire properly
      // Use a timeout as fallback based on estimated speech duration
      const estimatedDuration = Math.max(500, text.length * 80);
      const fallbackTimeout = setTimeout(() => {
        safeResolve();
      }, estimatedDuration);

      utterance.onend = () => {
        clearTimeout(fallbackTimeout);
        safeResolve();
      };

      utterance.onerror = (event) => {
        clearTimeout(fallbackTimeout);
        if (event.error !== 'interrupted') {
          console.warn('Speech error:', event.error);
        }
        safeResolve();
      };

      // Safari workaround: speech can get "stuck" if the page was inactive
      // A small delay after cancel() helps ensure it's ready
      setTimeout(() => {
        this.synthesis!.speak(utterance);

        // Safari workaround: sometimes speaking doesn't start
        // Check and retry once if needed
        setTimeout(() => {
          if (!this.synthesis!.speaking && !resolved) {
            this.synthesis!.speak(utterance);
          }
        }, 100);
      }, 10);
    });
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }
}
