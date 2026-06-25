"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  ShieldCheck,
  CreditCard,
  ChevronLeft,
  Calendar,
  Info,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import api from "../../../services/api.js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

function CheckoutForm({ order, onPaymentSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [isMock, setIsMock] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const response = await api.post("/payments/create-payment-intent", {
          orderId: order._id,
        });
        setClientSecret(response.data.clientSecret);
        setTransactionId(response.data.transactionId || "");
        if (response.data.clientSecret.startsWith("mock_client_secret")) {
          setIsMock(true);
        }
      } catch (err) {
        console.error("Failed to create payment intent", err);
        setErrorMessage("Failed to initialize payment gateway.");
      }
    };
    fetchPaymentIntent();
  }, [order]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setProcessing(true);

    if (isMock) {
      console.log("Simulating successful mock payment...");
      setTimeout(async () => {
        try {
          const confirmRes = await api.post("/payments/confirm", {
            orderId: order._id,
            transactionId: transactionId || "MOCK-TXN-" + Date.now(),
            amount: order.totalAmount,
          });
          onPaymentSuccess(confirmRes.data.payment);
        } catch (err) {
          setErrorMessage(
            err.response?.data?.message || "Mock payment confirmation failed.",
          );
          setProcessing(false);
        }
      }, 1500);
      return;
    }

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: order.buyerInfo.name,
              email: order.buyerInfo.email,
            },
          },
        },
      );

      if (error) {
        setErrorMessage(error.message);
        setProcessing(false);
      } else if (paymentIntent.status === "succeeded") {
        // Confirm transaction on backend
        const confirmRes = await api.post("/payments/confirm", {
          orderId: order._id,
          transactionId: paymentIntent.id,
          amount: order.totalAmount,
        });
        onPaymentSuccess(confirmRes.data.payment);
      }
    } catch (err) {
      setErrorMessage(err.message || "Payment processing error.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="flex items-center space-x-2 rounded-xl bg-red-50 p-4 text-xs text-red-600 dark:bg-red-950/20 dark:text-red-400 border border-red-200/50 dark:border-red-950/50">
          <Info className="h-5 w-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isMock ? (
        <div className="rounded-2xl border border-blue-500/20 bg-blue-50/10 p-5 space-y-4">
          <div className="flex items-center space-x-2 text-blue-500 dark:text-blue-400">
            <Info className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Mock Stripe Development Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Stripe keys are not configured or are set to mock values. Clicking
            below will instantly simulate a successful transaction and confirm
            the order.
          </p>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-xs space-y-1 font-mono">
            <div>Transaction ID: {transactionId || "Generated on success"}</div>
            <div>Status: Mock Pending</div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Card Details
          </label>
          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "14px",
                    color: "#0f172a",
                    "::placeholder": { color: "#94a3b8" },
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={processing || (!isMock && !stripe)}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/10 transition flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        <CreditCard className="h-5 w-5" />
        <span>
          {processing
            ? "Processing Payment..."
            : `Pay BDT ${order.totalAmount.toLocaleString()}`}
        </span>
      </button>
    </form>
  );
}

export default function Checkout({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;

  const { user } = useAuth();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Failed to load order for checkout", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  const handlePaymentSuccess = (payment) => {
    // Redirect to success page
    router.push(
      `/payment-success?txn=${payment.transactionId}&amount=${payment.amount}&date=${payment.paymentDate}&orderId=${order._id}`,
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50 dark:bg-slate-950">
        <AlertCircle className="h-12 w-12 text-slate-400 mb-4" />
        <h2 className="text-xl font-bold">Order not found</h2>
        <Link href="/products" className="text-blue-500 underline text-sm mt-2">
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-3 py-8 sm:px-6 lg:px-8 flex-1 w-full space-y-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center space-x-1 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Cancel Checkout</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
        {/* Left Column: Order Summary */}
        <div className="bg-white border border-slate-200/80 rounded-3xl dark:bg-slate-900 dark:border-slate-800 p-4 sm:p-6 md:p-8 space-y-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-black flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <span>Order Summary</span>
          </h2>

          <div className="flex gap-3 sm:gap-4 items-center">
            {order.productId?.images && (
              <img
                src={order.productId.images[0]}
                className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-xl border border-slate-200 dark:border-slate-800 flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                {order.productId?.title}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Quantity: {order.quantity} • Unit Price: BDT{" "}
                {order.productId?.price.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200/60 dark:border-slate-800 pt-4 space-y-3">
            <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between text-sm">
              <span className="text-slate-500 flex-shrink-0">
                Delivery Address
              </span>
              <span className="font-semibold sm:text-right text-slate-800 dark:text-slate-200 break-words">
                {order.deliveryAddress}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2 text-sm border-t border-slate-100 dark:border-slate-800 pt-3">
              <span className="text-slate-500 flex-shrink-0">Total Price</span>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                BDT {order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Stripe Checkout */}
        <div className="bg-white border border-slate-200/80 rounded-3xl dark:bg-slate-900 dark:border-slate-800 p-4 sm:p-6 md:p-8 space-y-6 shadow-sm">
          <h2 className="text-xl font-black flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            <span>Secure Checkout</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Your card details are fully encrypted and securely handled directly
            via Stripe.
          </p>

          <Elements stripe={stripePromise}>
            <CheckoutForm
              order={order}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
}
