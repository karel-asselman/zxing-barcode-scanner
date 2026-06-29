import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { BrowserMultiFormatReader, RGBLuminanceSource, BinaryBitmap, HybridBinarizer } from '@zxing/library';

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

  @ViewChild('scanCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private reader = new BrowserMultiFormatReader();
  private videoElement!: HTMLVideoElement;

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

     setTimeout(() => {
      this.videoElement = document.querySelector('zxing-scanner video') as HTMLVideoElement;
      if (this.videoElement) {
        this.startCropLoop();
      }
    }, 1000);
  }

  startCropLoop() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      if (this.videoElement && !this.videoElement.paused && !this.videoElement.ended) {
        ctx?.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
        
        // Define your ROI (Region of Interest) boundaries
        const roiWidth = 300;
        const roiHeight = 150;
        const roiX = Math.floor(canvas.width * 0.6);
        const roiY = Math.floor(canvas.height / 3);

        // Crop pixel matrix exclusively within the bounding coordinates
        const imgData = ctx?.getImageData(roiX, roiY, roiWidth, roiHeight);
        
        if (imgData) {
          this.decodeCroppedZone(imgData, roiWidth, roiHeight);
        }
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

decodeCroppedZone(imgData: ImageData, width: number, height: number) {
    const luminanceSource = new RGBLuminanceSource(
      new Uint8ClampedArray(imgData.data.buffer), 
      width, 
      height
    );
    const bitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

    try {
      // Decode hints are processed significantly quicker within a small matrix
      const result = this.reader.decodeBitmap(bitmap);
      this.scannedResult.push(result.getText());  
    } catch (e) {
      // No code found within the bounding box this frame
    }
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