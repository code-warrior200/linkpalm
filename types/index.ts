export interface Listing {
  id: string;
  title: string;
  pricePerUnit: number;
  unit: string;
  location: string;
  seller: string;
  sellerId: string;
  quantityAvailable: string;
  image?: string | number;
  images?: (string | number)[];
  description?: string;
  rating?: number;
  reviewCount?: number;
  isFavorite?: boolean;
}

export interface Order {
  id: string;
  listingId: string;
  listingTitle: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'in-transit' | 'delivered' | 'cancelled';
  date: string;
  seller: string;
  sellerId: string;
  buyer: string;
  buyerId: string;
  orderNumber: string;
  deliveryAddress?: string;
  notes?: string;
  trackingNumber?: string;
}

export interface Review {
  id: string;
  listingId: string;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  text: string;
  timestamp: string;
  read: boolean;
  listingId?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantNames: { [key: string]: string };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  listingId?: string;
  listingTitle?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'message' | 'review' | 'listing' | 'general';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionId?: string;
}

export type BuyerStackParamList = {
  BrowseHome: undefined;
  ListingDetails: { listing: Listing };
  Notifications: undefined;
  SellerContact: { sellerName: string; sellerId: string };
  SellerLocationMap: { sellerName: string; address: string };
  Favorites: undefined;
  PlaceOrder: { listing: Listing; quantity: number };
  ReviewListing: { listing: Listing; orderId: string };
  RateSeller: { sellerName: string; sellerId: string };
  Messages: undefined;
  Chat: { conversationId: string; receiverName: string };
};

export type OrdersStackParamList = {
  OrdersHome: undefined;
  OrderDetails: { order: Order };
  SellerContact: { sellerName: string; sellerId: string };
  SellerLocationMap: { sellerName: string; address: string };
  TrackOrder: { order: Order };
};

export type SellerStackParamList = {
  MyListingsHome: undefined;
  CreateListing: undefined;
  ListingDetails: { listing: Listing };
  SellerProfile: undefined;
  Analytics: undefined;
  SellerOrders: undefined;
  OrderDetails: { order: Order };
  Messages: undefined;
  Chat: { conversationId: string; receiverName: string };
};

export type BuyerTabParamList = {
  Browse: undefined;
  Orders: undefined;
  Favorites: undefined;
  BuyerProfile: undefined;
};

export type SellerTabParamList = {
  MyListings: undefined;
  SellerOrders: undefined;
  Analytics: undefined;
  SellerProfile: undefined;
};

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
};

