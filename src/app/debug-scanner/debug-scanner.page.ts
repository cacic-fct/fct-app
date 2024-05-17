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
  @ViewChild('scannerVideo', { static: false }) video: ElementRef<HTMLVideoElement>;

  @Input({ required: true }) delaySeconds: number;

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
  }

  /**
   * User device input
   */
  @Input({ required: true })
  set device(device: MediaDeviceInfo | undefined) {
    this.readBarcodeFromCanvas(device.deviceId);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.readBarcodeFromCanvas('user');
  }

  async readBarcodeFromCanvas(deviceId: string) {
    const video = this.video.nativeElement;

    video.setAttribute('id', 'video');

    // Needed for iOS
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    const canvas = this.scannerCanvas;
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const updateVideoStream = (deviceId: string) => {
      // To ensure the camera switch, it is advisable to free up the media resources
      if (video.srcObject instanceof MediaStream) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }

      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: deviceId }, audio: false })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
          processFrame(this.delaySeconds * 1000);
        })
        .catch(function (error) {
          console.error('Error accessing camera:', error);
        });
    };

    // TODO: Change the camera to the next available device
    updateVideoStream(deviceId);

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
}
