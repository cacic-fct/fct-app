import { Component } from '@angular/core';
import { ServiceWorkerService } from 'src/app/shared/services/service-worker/service-worker.service';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  bookOutline,
  codeOutline,
  hammerOutline,
  warningOutline,
  refreshOutline,
  banOutline,
  serverOutline,
  play,
  logoFacebook,
  logoInstagram,
  logoLinkedin,
  logoTwitter,
  logoYoutube,
  mailOutline,
  globeOutline,
  callOutline,
  cash,
  paperPlane,
  pencil,
  ellipsisHorizontal,
  time,
  checkmark,
  person,
  shareSocialOutline,
  download,
  walletOutline,
  documentTextOutline,
  list,
  eye,
  settingsOutline,
  trashOutline,
  peopleOutline,
  listOutline,
  folderOpenOutline,
  add,
  close,
  qrCodeOutline,
  copy,
  folder,
  pin,
  sendOutline,
  flashOutline,
  cameraReverseOutline,
  arrowUp,
  arrowDown,
  pencilOutline,
  cashOutline,
  trash,
  chevronBack,
  chevronForward,
  mail,
  logoWhatsapp,
  sunny,
  cloudy,
  partlySunny,
  snow,
  rainy,
  thunderstorm,
  moon,
  calendar,
  albums,
  map,
  handRightOutline,
  menuOutline,
  filter,
  todayOutline,
  shareSocial,
  informationCircleOutline,
  calendarOutline,
  closeOutline,
  logInOutline,
  logOutOutline,
  personCircleOutline,
  albumsOutline,
  schoolOutline,
  peopleCircleOutline,
  buildOutline,
  search,
  closeCircleOutline,
  cloudUpload,
  checkmarkCircle,
  closeCircle,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private swService: ServiceWorkerService) {
    // TODO: Não importar tudo em app.component.ts
    addIcons({
      bookOutline,
      codeOutline,
      hammerOutline,
      warningOutline,
      refreshOutline,
      banOutline,
      serverOutline,
      play,
      logoFacebook,
      logoInstagram,
      logoLinkedin,
      logoTwitter,
      logoYoutube,
      mailOutline,
      globeOutline,
      callOutline,
      cash,
      paperPlane,
      pencil,
      ellipsisHorizontal,
      time,
      checkmark,
      person,
      shareSocialOutline,
      download,
      walletOutline,
      documentTextOutline,
      list,
      eye,
      settingsOutline,
      trashOutline,
      peopleOutline,
      listOutline,
      folderOpenOutline,
      add,
      close,
      qrCodeOutline,
      copy,
      folder,
      pin,
      sendOutline,
      flashOutline,
      cameraReverseOutline,
      arrowUp,
      arrowDown,
      pencilOutline,
      cashOutline,
      trash,
      chevronBack,
      chevronForward,
      mail,
      logoWhatsapp,
      sunny,
      cloudy,
      partlySunny,
      snow,
      rainy,
      thunderstorm,
      moon,
      calendar,
      albums,
      map,
      handRightOutline,
      menuOutline,
      filter,
      todayOutline,
      shareSocial,
      informationCircleOutline,
      calendarOutline,
      closeOutline,
      logInOutline,
      logOutOutline,
      personCircleOutline,
      albumsOutline,
      schoolOutline,
      peopleCircleOutline,
      buildOutline,
      search,
      closeCircleOutline,
      cloudUpload,
      checkmarkCircle,
      closeCircle,
    });
  }
}
