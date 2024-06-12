import { QRCode } from "./qr-code";

export type Crate = {
  id: string;
  address: string;
  positionName: string;
  longitude: number;
  latitude: number;
  qrCode?: QRCode;
};
