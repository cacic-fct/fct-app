import { Injectable } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import { parse } from 'twemoji-parser';

@Injectable({
  providedIn: 'root',
})
export class EmojiService {
  constructor(private sanitizer: DomSanitizer) {}

  getEmoji(emoji: string): any {
    if (emoji === undefined || !/^\p{Emoji}|\p{Emoji_Modifier}$/u.test(emoji)) {
      // TODO: validar apenas 1 emoji
      return this.sanitizer.bypassSecurityTrustResourceUrl(parse('❔')[0].url);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(parse(emoji)[0].url);
  }
}
