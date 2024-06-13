export type Prize = {
  id: string;
  name: string;
  displayName: string;
  totalSupply: number;
  circulatingSupply: number;
  claimedSupply: number;
  imageUrl?: string;
  progressValue?: number;
};

export enum NamePrize {
  IPHONE = "iphone",
  VR = "casque-vr",
  PS5 = "ps5",
  AIRPOD = "airpod",
  HEADPHONES = "casque-audio",
  GIFT_VOUCHER_MANOR = "bon-cadeau-manor-50",
  GIFT_VOUCHER_FNAC = "bon-cadeau-fnac-50",
  GIFT_VOUCHER_PAYOT = "bon-cadeau-payot-30",
  GIFT_VOUCHER_MIGROS = "bon-cadeau-migros-20",
}

export function getImageOf(name: string): string {
  switch (name) {
    case NamePrize.VR:
      return "/images/casque-vr.png";
    case NamePrize.AIRPOD:
      return "/images/airpods.png";
    case NamePrize.PS5:
      return "/images/ps5.png";
    case NamePrize.HEADPHONES:
      return "/images/casque-audio.png";
    case NamePrize.GIFT_VOUCHER_MANOR:
      return "/images/manor-logo.png";
    case NamePrize.GIFT_VOUCHER_FNAC:
      return "/images/fnac-logo.png";
    case NamePrize.GIFT_VOUCHER_PAYOT:
      return "/images/payot-logo.png";
    case NamePrize.GIFT_VOUCHER_MIGROS:
      return "/images/migros-logo.png";
    default:
      return "/images/iphone-15-pro-max.png";
  }
}
