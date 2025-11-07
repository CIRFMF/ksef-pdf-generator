import { Window } from 'happy-dom';
import type { IEnvironmentInitializer } from '../interfaces/IEnvironmentInitializer.js';

export class BrowserEnvironmentInitializer implements IEnvironmentInitializer {
  private dom!: Window;
  private vfsStorage: any = {};

  initialize(): void {
    this.setupPdfMake();
    this.setupHappyDom();
    this.setupCanvasMock();
  }

  private setupPdfMake(): void {
    (global as any).pdfMake = {
      vfs: this.vfsStorage,
      fonts: {
        Roboto: {
          normal: 'Roboto-Regular.ttf',
          bold: 'Roboto-Medium.ttf',
          italics: 'Roboto-Italic.ttf',
          bolditalics: 'Roboto-MediumItalic.ttf'
        }
      },
      addVirtualFileSystem: (vfs: any) => {
        Object.assign(this.vfsStorage, vfs);
        console.log('✓ Fonty VFS załadowane:', Object.keys(vfs).length, 'plików');
      }
    };
  }

  private setupHappyDom(): void {
    this.dom = new Window({
      url: 'http://localhost',
      width: 1024,
      height: 768
    });

    (global as any).window = this.dom;
    (global as any).document = this.dom.document;
    (global as any).FileReader = this.dom.FileReader;
    (global as any).Blob = this.dom.Blob;
    (global as any).File = this.dom.File;
    (global as any).DOMParser = this.dom.DOMParser;
    (global as any).XMLSerializer = this.dom.XMLSerializer;

    (this.dom as any).pdfMake = (global as any).pdfMake;
  }

  private setupCanvasMock(): void {
    (global as any).HTMLCanvasElement = class HTMLCanvasElement {
      getContext() {
        return {
          measureText: (text: string) => ({ width: text.length * 10 }),
          fillText: () => {},
          fillRect: () => {},
        };
      }
    };
  }
}
