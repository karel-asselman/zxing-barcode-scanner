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
  allowedFormats = [BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128];
  scannedResult: Array<string> = [];
  hasDevices = false;
  availableDevices: MediaDeviceInfo[] = [];
  selectedDevice: MediaDeviceInfo | undefined;

  videoConstraints: MediaTrackConstraints = {
    width: { ideal: 3840 },
    height: { ideal: 2160 },
    facingMode: 'environment',
    advanced: [{ focusMode: 'continuous', focusDistance: '0.1' } as any]
  };


  onCamerasFound(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
    if (devices.length > 0) {
      this.selectedDevice = devices[0];
    }
  }


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

  onError(error: any) {
    console.error('Barcode scanning error:', error);
  }

  getName(format: BarcodeFormat): string {
    return BarcodeFormat[format] || 'Unknown Format';
  }
}