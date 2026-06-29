import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  selectedFormat: 'QR' | 'Code128' = 'QR';
  allowedFormats = [BarcodeFormat.QR_CODE];
  scannedResult: Array<string> = [];
  hasDevices = false;
  availableDevices: MediaDeviceInfo[] = [];
  selectedDevice: MediaDeviceInfo | undefined;

  videoConstraints: MediaTrackConstraints = {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    advanced: [{ aspectRatio: 1 / 1 }]
  };

  onCodeResult(result: string) {
    this.scannedResult.push(result);
  }

  onDeviceSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedDevice = this.availableDevices.find(device => device.deviceId === target.value);
  }

  onHasDevices(hasDevices: boolean) {
    this.hasDevices = hasDevices;
  }

  onDevicesFound(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
    if (devices.length > 0) {
      this.selectedDevice = devices[0];
    }
  }

  onFormatChange(format: 'QR' | 'Code128') {
    this.selectedFormat = format;
    this.allowedFormats = format === 'QR' ? [BarcodeFormat.QR_CODE] : [BarcodeFormat.CODE_128];
    this.videoConstraints = {
      ...this.videoConstraints,
      advanced: [{ aspectRatio: format === 'QR' ? 1 / 1 : 3 / 1 }]
    };
  }

  onError(error: any) {
    console.error('Barcode scanning error:', error);
  }

  getName(format: BarcodeFormat): string {
    return BarcodeFormat[format] || 'Unknown Format';    
  }
}