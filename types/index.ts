export interface Listing {
  id: string;
  title: string;
  pricePerUnit: number;
  unit: string;
  location: string;
  seller: string;
  quantityAvailable: string;
}

export interface Order {
  id: string;
  listingTitle: string;
  quantity: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  date: string;
  seller: string;
  orderNumber: string;
}

export type BuyerStackParamList = {
  Browse: undefined;
  ListingDetails: { listing: Listing };
  Notifications: undefined;
  SellerContact: { sellerName: string };
  SellerLocationMap: { sellerName: string; address: string };
};

export type OrdersStackParamList = {
  Orders: undefined;
  OrderDetails: { order: Order };
  SellerContact: { sellerName: string };
  SellerLocationMap: { sellerName: string; address: string };
};

export type SellerStackParamList = {
  MyListings: undefined;
  CreateListing: undefined;
  ListingDetails: { listing: Listing };
  SellerProfile: undefined;
  Analytics: undefined;
};

export type BuyerTabParamList = {
  Browse: undefined;
  Orders: undefined;
  BuyerProfile: undefined;
};

export type SellerTabParamList = {
  MyListings: undefined;
  Analytics: undefined;
  SellerProfile: undefined;
};

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
};

