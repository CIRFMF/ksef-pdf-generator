import { Watermark } from 'pdfmake/interfaces';

export function generateWatermark(watermark?: string | Watermark): Record<'watermark', Watermark> | null {
  if (typeof watermark === 'string' && watermark.trim() !== '') {
    return {
      watermark: {
        text: watermark,
        color: '#B1B1B1',
        opacity: 0.2,
        bold: true,
        fontSize: 50,
      },
    };
  } else if (typeof watermark === 'object' && watermark.text && watermark.text.trim() !== '') {
    return {
      watermark,
    };
  }

  return null;
}
