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
  allowedFormats = [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX, BarcodeFormat.AZTEC];
  scannedResult: string | null = null;
  hasDevices = false;
  availableDevices: MediaDeviceInfo[] = [];
  selectedDevice: MediaDeviceInfo | undefined;  // Fix: Use `undefined` instead of `null`

  onCodeResult(result: string) {
    this.scannedResult = result;
  }

  onDeviceSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement; // Fix: Properly typecast EventTarget
    this.selectedDevice = this.availableDevices.find(device => device.deviceId === target.value);
  }

  onHasDevices(hasDevices: boolean) {
    this.hasDevices = hasDevices;
  }

  onDevicesFound(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
    if (devices.length > 0) {
      this.selectedDevice = devices[0]; // Fix: Ensure a device is selected initially
    }
  }

  onError(error: any) {
    console.error('Barcode scanning error:', error);
  }
}