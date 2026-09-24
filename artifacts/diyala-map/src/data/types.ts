export type FilterKind = string;

export interface MapItem {
  id: number;
  kind: string;
  category: string;
  name: string;
  details?: string;
  address: string;
  phone: string;
  hours: string;
  status: string;
  rating?: number | null;
  lat: number;
  lng: number;
  icon_url?: string | null;
  // legacy static-data fields kept for compat
  doctor?: string;
  specialty?: string;
  cuisine?: string;
  type?: string;
  pharmacist?: string;
}

export interface Category {
  id: number;
  slug: string;
  labelAr: string;
  labelEn: string;
  color: string;
  icon: string;
}

export interface ShopDeal {
  id: string;
  title: string;
  conditions: string;
  discountType: "percent" | "amount";
  discountValue: number;
  shopName: string;
  shopLocationId: string;
  shopImageUrl: string;
  code: string;
  status: "active";
  createdAt: string;
  expiresAt: string;
}

export type ShopDealsStatus = "loading" | "ready" | "error";
