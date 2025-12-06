import { z } from 'zod';
import { AdditionalDataTypes } from '../lib-public/types/common.types';

export const AdditionalDataSchema: z.ZodType<AdditionalDataTypes> = z.object({
  nrKSeF: z.string().min(1, 'nrKSeF is required'),
  qrCode: z.string().optional(),
  isMobile: z.boolean().optional(),
});
