import { create } from "zustand";

export type UniverseScene =
  | "loading"
  | "arrival"
  | "exterior"
  | "entering"
  | "mainHall"
  | "productDetail"
  | "cart"
  | "profile"
  | "checkout";

export interface CartItem {
  /** pedestalKey + color + size মিলিয়ে unique cart line item id */
  cartItemId: string;
  productId: string;
  name: string;
  nameBn: string;
  price: number;
  colorName: string;
  colorHex: string;
  size: string;
  quantity: number;
  zoneColor: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  district: string;
  area: string;
  fullAddress: string;
  notes: string;
}

export type PaymentMethod = "card" | "mobile-banking" | "cod";

export interface PlacedOrder {
  orderId: string;
  items: CartItem[];
  address: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  total: number;
  placedAt: number;
}

interface UniverseState {
  scene: UniverseScene;
  setScene: (scene: UniverseScene) => void;

  loadingProgress: number;
  /** number অথবা (prev: number) => number দুটোই accept করে */
  setLoadingProgress: (updater: number | ((prev: number) => number)) => void;

  isAudioEnabled: boolean;
  toggleAudio: () => void;

  activeZone: string | null;
  setActiveZone: (zone: string | null) => void;

  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;

  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "cartItemId" | "quantity">) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;

  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  /** Add to Cart চাপার সময় fly-to-cart animation trigger করতে — short-lived signal */
  flyToCartSignal: { id: number; colorHex: string } | null;
  triggerFlyToCart: (colorHex: string) => void;

  checkoutStep: "address" | "payment" | "confirmation";
  setCheckoutStep: (step: "address" | "payment" | "confirmation") => void;

  shippingAddress: ShippingAddress | null;
  setShippingAddress: (address: ShippingAddress) => void;

  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;

  lastOrder: PlacedOrder | null;
  placeOrder: () => void;
  resetCheckout: () => void;
}

export const useUniverseStore = create<UniverseState>((set, get) => ({
  scene: "loading",
  setScene: (scene) => set({ scene }),

  loadingProgress: 0,
  setLoadingProgress: (updater) => {
    if (typeof updater === "function") {
      set({ loadingProgress: updater(get().loadingProgress) });
    } else {
      set({ loadingProgress: updater });
    }
  },

  isAudioEnabled: false,
  toggleAudio: () => set((state) => ({ isAudioEnabled: !state.isAudioEnabled })),

  activeZone: null,
  setActiveZone: (zone) => set({ activeZone: zone }),

  selectedProductId: null,
  setSelectedProductId: (id) => set({ selectedProductId: id }),

  isSearchOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),

  cartItems: [],
  addToCart: (item) =>
    set((state) => {
      // একই product + color + size আগে থেকেই থাকলে quantity বাড়াও,
      // নাহলে নতুন line item যোগ করো।
      const cartItemId = `${item.productId}-${item.colorName}-${item.size}`;
      const existing = state.cartItems.find((c) => c.cartItemId === cartItemId);

      if (existing) {
        return {
          cartItems: state.cartItems.map((c) =>
            c.cartItemId === cartItemId ? { ...c, quantity: c.quantity + 1 } : c
          ),
        };
      }

      return {
        cartItems: [...state.cartItems, { ...item, cartItemId, quantity: 1 }],
      };
    }),

  removeFromCart: (cartItemId) =>
    set((state) => ({
      cartItems: state.cartItems.filter((c) => c.cartItemId !== cartItemId),
    })),

  updateCartQuantity: (cartItemId, quantity) =>
    set((state) => ({
      cartItems:
        quantity <= 0
          ? state.cartItems.filter((c) => c.cartItemId !== cartItemId)
          : state.cartItems.map((c) =>
              c.cartItemId === cartItemId ? { ...c, quantity } : c
            ),
    })),

  clearCart: () => set({ cartItems: [] }),

  isCartOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),

  flyToCartSignal: null,
  triggerFlyToCart: (colorHex) =>
    set({ flyToCartSignal: { id: Date.now(), colorHex } }),

  checkoutStep: "address",
  setCheckoutStep: (step) => set({ checkoutStep: step }),

  shippingAddress: null,
  setShippingAddress: (address) => set({ shippingAddress: address }),

  paymentMethod: "mobile-banking",
  setPaymentMethod: (method) => set({ paymentMethod: method }),

  lastOrder: null,
  placeOrder: () => {
    const state = get();
    if (!state.shippingAddress || state.cartItems.length === 0) return;

    const subtotal = state.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal >= 2000 ? 0 : 80;

    const order: PlacedOrder = {
      orderId: `BF-${Date.now().toString(36).toUpperCase()}`,
      items: [...state.cartItems],
      address: state.shippingAddress,
      paymentMethod: state.paymentMethod,
      subtotal,
      shipping,
      total: subtotal + shipping,
      placedAt: Date.now(),
    };

    set({
      lastOrder: order,
      cartItems: [],
      checkoutStep: "confirmation",
    });
  },

  resetCheckout: () =>
    set({
      checkoutStep: "address",
      shippingAddress: null,
      paymentMethod: "mobile-banking",
      lastOrder: null,
    }),
}));
