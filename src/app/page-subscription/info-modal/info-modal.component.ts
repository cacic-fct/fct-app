import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { EventItem } from 'src/app/shared/services/event';
import { parse } from 'twemoji-parser';
import { DomSanitizer } from '@angular/platform-browser';
import { DatesService } from 'src/app/shared/services/dates.service';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
})
export class InfoModalComponent implements OnInit {
  @Input() event: EventItem;

  constructor(private sanitizer: DomSanitizer, private modalController: ModalController, public dates: DatesService) {}

  ngOnInit() {}

  toUppercase(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getEmoji(emoji: string): any {
    if (emoji === undefined || !/^\p{Emoji}|\p{Emoji_Modifier}$/u.test(emoji)) {
      // TODO: validar apenas 1 emoji
      return this.sanitizer.bypassSecurityTrustResourceUrl(parse('❔')[0].url);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(parse(emoji)[0].url);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
