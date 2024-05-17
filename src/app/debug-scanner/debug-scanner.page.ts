import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

import { readBarcodesFromImageData, ReadResult } from 'zxing-wasm';

@Component({
  selector: 'app-debug-scanner',
  templateUrl: './debug-scanner.page.html',
  styleUrls: ['./debug-scanner.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
})
export class DebugScannerPage implements OnInit, AfterViewInit {
  // @ViewChild('scannerCanvas', { static: false }) scannerCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('scannerVideo', { static: false }) video: ElementRef<HTMLVideoElement>;

  @Input({ required: true }) delaySeconds: number;

  videoWidth: number;
  videoHeight: number;

  deviceIndex: number = -1;
  currentDevice: MediaDeviceInfo | null = null;
  availableDevices!: MediaDeviceInfo[];
  hasDevices: boolean = false;
  hasNavigator: boolean | undefined;

  hasPermission: boolean | null = null;
  isMediaDevicesSupported: boolean | undefined;

  scannerCanvas: HTMLCanvasElement;

  constructor() {
    this.hasNavigator = typeof navigator !== 'undefined';
    this.isMediaDevicesSupported = this.hasNavigator && !!navigator.mediaDevices;
    this.scannerCanvas = document.createElement('canvas');

    // this.askForPermission();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.readBarcodeFromCanvas();
    }, 1000);
  }

  async readBarcodeFromCanvas() {
    this.videoWidth = this.video.nativeElement.videoHeight;
    this.videoHeight = this.video.nativeElement.videoWidth;
    const video = this.video.nativeElement;

    video.setAttribute('id', 'video');

    // Needed for iOS
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    updateVideoStream('user');

    const canvas = this.scannerCanvas;
    canvas.width = this.videoWidth;
    canvas.height = this.videoHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    function updateVideoStream(deviceId: string) {
      // To ensure the camera switch, it is advisable to free up the media resources
      if (video.srcObject instanceof MediaStream) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }

      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: deviceId }, audio: false })
        .then(function (stream) {
          video.srcObject = stream;
          video.play();

          processFrame(1000);
        })
        .catch(function (error) {
          console.error('Error accessing camera:', error);
        });
    }

    const processFrame = async function (delay: number) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      let imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);

      const imageDataReadResults: ReadResult[] = await readBarcodesFromImageData(imageData, {
        tryHarder: true,
        tryDownscale: true,
      });

      let result = false;

      if (imageDataReadResults.length > 0) {
        result = imageDataReadResults[0].isValid;

        if (result) {
          console.log('Barcode read from image data:', imageDataReadResults);
        }
      }

      const timeout = !result ? 0 : delay;
      setTimeout(() => requestAnimationFrame(processFrame.bind(null, delay)), timeout);
    };
  }

  changeCamera(): void {
    this.deviceIndex++;
    if (this.deviceIndex === this.availableDevices.length) {
      this.deviceIndex = 0;
    }
    this.currentDevice = this.availableDevices[this.deviceIndex];
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  async askForPermission(): Promise<boolean> {
    if (!this.hasNavigator) {
      console.error('@zxing/ngx-scanner', "Can't ask permission, navigator is not present.");
      this.setPermission(null);
      return this.hasPermission;
    }

    if (!this.isMediaDevicesSupported) {
      console.error('@zxing/ngx-scanner', "Can't get user media, this is not supported.");
      this.setPermission(null);
      return this.hasPermission;
    }

    let stream: MediaStream;
    let permission: boolean;

    try {
      // Will try to ask for permission
      stream = await this.getAnyVideoDevice();
      permission = !!stream;
    } catch (err) {
      // TODO:
      // return this.handlePermissionException(err);
    } finally {
      this.terminateStream(stream);
    }

    this.setPermission(permission);

    // Returns the permission
    return permission;
  }

  getAnyVideoDevice(): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({ video: true });
  }

  private terminateStream(stream: MediaStream) {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }

    stream = undefined;
  }

  private setPermission(hasPermission: boolean | null): void {
    this.hasPermission = hasPermission;
  }

  // private async initAutostartOn(): Promise<void> {

  //   this.isAutostarting = true;

  //   let hasPermission: boolean;

  //   try {
  //     // Asks for permission before enumerating devices so it can get all the device's info
  //     hasPermission = await this.askForPermission();
  //   } catch (e) {
  //     console.error('Exception occurred while asking for permission:', e);
  //     return;
  //   }

  //   // from this point, things gonna need permissions
  //   if (hasPermission) {
  //     const devices = await this.updateVideoInputDevices();
  //     await this.autostartScanner([...devices]);
  //   }

  //   this.isAutostarting = false;
  //   this.autostarted.next();
  // }

  // private async autostartScanner(devices: MediaDeviceInfo[]): Promise<void> {
  //   const matcher = ({ label }) => /back|trás|rear|traseira|environment|ambiente/gi.test(label);

  //   // select the rear camera by default, otherwise take the last camera.
  //   const device = devices.find(matcher) || devices.pop();

  //   if (!device) {
  //     throw new Error('Impossible to autostart, no input devices available.');
  //   }

  //   await this.setDevice(device);

  //   this.deviceChange.next(device);
  // }

  // private async setDevice(device: MediaDeviceInfo): Promise<void> {
  //   // instantly stops the scan before changing devices
  //   this.scanStop();

  //   // correctly sets the new (or none) device
  //   this._device = device || undefined;

  //   if (!this._device) {
  //     // cleans the video because user removed the device
  //     BrowserCodeReader.cleanVideoSource(this.previewElemRef.nativeElement);
  //   }

  //   // if enabled, starts scanning
  //   if (this._enabled && device) {
  //     await this.scanFromDevice(device.deviceId);
  //   }
  // }
}
