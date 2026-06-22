"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useUniverseStore, ShippingAddress } from "@/store/useUniverseStore";
import CheckoutStepIndicator from "@/components/ui/checkout/CheckoutStepIndicator";
import OrderSummary from "@/components/ui/checkout/OrderSummary";
import AddressForm from "@/components/ui/checkout/AddressForm";
import PaymentMethodSelector from "@/components/ui/checkout/PaymentMethodSelector";
import OrderConfirmation from "@/components/ui/checkout/OrderConfirmation";

/**
 * Phase 9: Checkout Flow।
 *
 * তিনটা ধাপ — Address → Payment → Order Confirmation। Cart-এ কোনো item
 * না থাকলে (এবং কোনো lastOrder-ও না থাকলে) সরাসরি checkout-এ ঢোকা ঠেকানো
 * হয়, কারণ খালি cart দিয়ে checkout করার কোনো মানে নেই।
 *
 * Confirmation ধাপে পৌঁছালে cart store-এর `placeOrder()` দিয়ে
 * automatically clear হয়ে যায় (store-এর logic-এ), তাই সেই মুহূর্তে
 * cartItems.length === 0 হলেও lastOrder থাকলে confirmation দেখানো হয়।
 */
export default function CheckoutScene() {
  const setScene = useUniverseStore((s) => s.setScene);
  const cartItems = useUniverseStore((s) => s.cartItems);

  const checkoutStep = useUniverseStore((s) => s.checkoutStep);
  const setCheckoutStep = useUniverseStore((s) => s.setCheckoutStep);

  const shippingAddress = useUniverseStore((s) => s.shippingAddress);
  const setShippingAddress = useUniverseStore((s) => s.setShippingAddress);

  const paymentMethod = useUniverseStore((s) => s.paymentMethod);
  const setPaymentMethod = useUniverseStore((s) => s.setPaymentMethod);

  const lastOrder = useUniverseStore((s) => s.lastOrder);
  const placeOrder = useUniverseStore((s) => s.placeOrder);
  const resetCheckout = useUniverseStore((s) => s.resetCheckout);

  const handleBackToHall = useCallback(() => {
    setScene("mainHall");
  }, [setScene]);

  const handleAddressSubmit = useCallback(
    (address: ShippingAddress) => {
      setShippingAddress(address);
      setCheckoutStep("payment");
    },
    [setShippingAddress, setCheckoutStep]
  );

  const handlePlaceOrder = useCallback(() => {
    placeOrder();
  }, [placeOrder]);

  const handleContinueShopping = useCallback(() => {
    resetCheckout();
    setScene("mainHall");
  }, [resetCheckout, setScene]);

  // ── Confirmation ধাপ — নিজস্ব full-screen layout, sidebar ছাড়া ──
  if (checkoutStep === "confirmation" && lastOrder) {
    return (
      <div className="flex h-screen w-full items-center justify-center overflow-y-auto bg-void px-6 py-12">
        <OrderConfirmation
          order={lastOrder}
          onContinueShopping={handleContinueShopping}
        />
      </div>
    );
  }

  // ── Empty cart guard — address/payment ধাপে item ছাড়া ঢোকা ঠেকানো ──
  if (cartItems.length === 0) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-5 bg-void px-6 text-center">
        <ShoppingBag size={32} className="text-smoke/30" strokeWidth={1.25} />
        <h2 className="font-display text-2xl font-bold text-bone">
          তোমার ব্যাগ খালি
        </h2>
        <p className="max-w-xs font-body text-sm text-smoke">
          Checkout করার আগে Main Hall থেকে কিছু product যোগ করো।
        </p>
        <button
          onClick={handleBackToHall}
          className="rounded-full border border-ember/30 px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-ember transition-colors hover:bg-ember/5"
        >
          ← Main Hall-এ ফিরে যাও
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-y-auto bg-void px-5 pb-16 pt-6 sm:px-10">
      {/* Back button */}
      <button
        onClick={handleBackToHall}
        className="glass-panel pointer-events-auto mb-6 flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-smoke transition-colors hover:text-bone"
      >
        <ArrowLeft size={13} strokeWidth={1.75} />
        Hall
      </button>

      {/* Step indicator */}
      <div className="mb-8">
        <CheckoutStepIndicator currentStep={checkoutStep} />
      </div>

      {/* Two-column layout — form left, summary right (desktop); stacked (mobile) */}
      <div className="mx-auto flex max-w-4xl flex-col gap-8 md:flex-row md:items-start">
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {checkoutStep === "address" && (
              <motion.div
                key="address"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="mb-5 font-display text-xl font-bold text-bone">
                  Shipping Address
                </h2>
                <AddressForm
                  initialValue={shippingAddress}
                  onSubmit={handleAddressSubmit}
                />
              </motion.div>
            )}

            {checkoutStep === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="mb-5 font-display text-xl font-bold text-bone">
                  Payment Method
                </h2>
                <PaymentMethodSelector
                  selected={paymentMethod}
                  onSelect={setPaymentMethod}
                  onConfirm={handlePlaceOrder}
                  onBack={() => setCheckoutStep("address")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order summary sidebar */}
        <div className="w-full shrink-0 md:w-80">
          <OrderSummary items={cartItems} />
        </div>
      </div>
    </div>
  );
}
