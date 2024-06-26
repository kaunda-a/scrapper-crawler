import { Page } from 'puppeteer';
export const preventFingerprinting = async (page: Page) => {
    await page.evaluateOnNewDocument(() => {
      // Prevent WebGL fingerprinting
      const getParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function(parameter) {
        if (parameter === 37445) {
          return 'Intel Inc.';
        }
        if (parameter === 37446) {
          return 'Intel Iris OpenGL Engine';
        }
        return getParameter.call(this, parameter);
      };
  
      // Prevent Canvas fingerprinting
      const toDataURL = HTMLCanvasElement.prototype.toDataURL;
      HTMLCanvasElement.prototype.toDataURL = function(type) {
        if (type === 'image/png') {
          return toDataURL.call(this, type, 0.5);
        }
        return toDataURL.call(this, type);
      };
  
      // Prevent WebRTC IP leakage
      Object.defineProperty(navigator, 'mediaDevices', {
        value: {
          getUserMedia: () => Promise.reject(new Error('getUserMedia not supported')),
        },
      });
    });
  };
  