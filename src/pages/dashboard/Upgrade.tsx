// import { useState, useEffect } from "react";
// import { toast } from "react-hot-toast";
// import { CheckCircle, AlertCircle, Crown, ArrowRight } from "lucide-react";
// import { api } from "../../lib/api";
// import { useAuth } from "../../context/AuthContext";
// import LoadingSpinner from "../../components/ui/LoadingSpinner";

// interface Plan {
//   id: string;
//   name: string;
//   price: number;
//   currency: string;
//   billingCycle?: string;
//   features: string[];
// }

// interface SubscriptionStatus {
//   plan: string;
//   subscription: {
//     status: string;
//     startDate?: string;
//     endDate?: string;
//     daysLeft?: number;
//   } | null;
// }

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// const Upgrade = () => {
//   const { user, isPremium, refreshUser } = useAuth();
//   const [plans, setPlans] = useState<Plan[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [subscriptionStatus, setSubscriptionStatus] =
//     useState<SubscriptionStatus | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isCancelling, setIsCancelling] = useState(false);

//   useEffect(() => {
//     const fetchPlans = async () => {
//       try {
//         const { data } = await api.get("/api/plans");
//         setPlans(data.plans);
//       } catch (error) {
//         console.error("Error fetching plans:", error);
//         toast.error("Failed to load subscription plans");
//       }
//     };

//     const fetchSubscriptionStatus = async () => {
//       try {
//         const { data } = await api.get("/api/subscription/status");
//         setSubscriptionStatus(data);
//       } catch (error) {
//         console.error("Error fetching subscription status:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPlans();
//     fetchSubscriptionStatus();
//   }, []);

//   const handleSubscribe = async (planId: string) => {
//     if (planId === "free") {
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       // Load Razorpay script if not already loaded
//       if (!window.Razorpay) {
//         await new Promise<void>((resolve, reject) => {
//           const script = document.createElement("script");
//           script.src = "https://checkout.razorpay.com/v1/checkout.js";
//           script.onload = () => resolve();
//           script.onerror = () =>
//             reject(new Error("Failed to load Razorpay checkout."));
//           document.body.appendChild(script);
//         });
//       }

//       // Create payment order
//       const { data } = await api.post("/api/subscription/create-order", {
//         orderId: Date.now().toString(36), // Generate a shorter order ID
//       });

//       // Open Razorpay checkout
//       const options = {
//         key: data.key,
//         amount: data.order.amount,
//         currency: data.order.currency,
//         name: "PixelVault",
//         description: "Premium Subscription",
//         order_id: data.order.id,
//         handler: async function (response: any) {
//           try {
//             // Verify payment
//             await api.post("/api/subscription/verify-payment", {
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature,
//             });

//             // Refresh user data and subscription status
//             await refreshUser();
//             const { data } = await api.get("/api/subscription/status");
//             setSubscriptionStatus(data);

//             toast.success("Payment successful! You are now a premium user.");
//           } catch (error) {
//             console.error("Payment verification error:", error);
//             toast.error("Payment verification failed");
//           }
//         },
//         prefill: {
//           name: user?.username,
//           email: user?.email,
//         },
//         theme: {
//           color: "#4F46E5",
//         },
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
//     } catch (error) {
//       console.error("Subscription error:", error);
//       toast.error("Failed to initiate payment");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleCancelSubscription = async () => {
//     if (
//       !window.confirm(
//         "Are you sure you want to cancel your subscription? You will still have premium access until the end of your billing period."
//       )
//     ) {
//       return;
//     }

//     setIsCancelling(true);

//     try {
//       const { data } = await api.post("/api/subscription/cancel");

//       toast.success(data.message);

//       // Refresh subscription status
//       const response = await api.get("/api/subscription/status");
//       setSubscriptionStatus(response.data);

//       // Refresh user data
//       await refreshUser();
//     } catch (error) {
//       console.error("Cancellation error:", error);
//       toast.error("Failed to cancel subscription");
//     } finally {
//       setIsCancelling(false);
//     }
//   };

//   return (
//     <div className="fade-in">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//           Subscription Plans
//         </h1>
//         <p className="text-gray-600 dark:text-gray-300">
//           Choose the plan that's right for you
//         </p>
//       </div>

//       {isLoading ? (
//         <div className="flex justify-center py-12">
//           <LoadingSpinner size="lg" />
//         </div>
//       ) : (
//         <>
//           {/* Current subscription status */}
//           {subscriptionStatus && (
//             <div className="mb-8">
//               <div
//                 className={`card p-6 ${
//                   isPremium
//                     ? "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20"
//                     : ""
//                 }`}
//               >
//                 <div className="flex items-start">
//                   <div
//                     className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
//                       isPremium
//                         ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400"
//                         : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
//                     }`}
//                   >
//                     <Crown className="h-5 w-5" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
//                       Your current plan: {isPremium ? "Premium" : "Free"}
//                     </h3>

//                     {isPremium && subscriptionStatus?.subscription ? (
//                       <div className="text-gray-600 dark:text-gray-300">
//                         {subscriptionStatus.subscription.status === "active" ? (
//                           <>
//                             <p>
//                               Your premium subscription is active until{" "}
//                               {new Date(
//                                 subscriptionStatus.subscription.endDate || ""
//                               ).toLocaleDateString("en-US", {
//                                 year: "numeric",
//                                 month: "long",
//                                 day: "numeric",
//                               })}
//                             </p>
//                             {subscriptionStatus.subscription.daysLeft !==
//                               undefined && (
//                               <p className="mt-1">
//                                 <span className="font-medium">
//                                   {subscriptionStatus.subscription.daysLeft}
//                                 </span>{" "}
//                                 days remaining
//                               </p>
//                             )}
//                             {subscriptionStatus.subscription.status !==
//                               ("cancelled" as string) && (
//                               <button
//                                 onClick={handleCancelSubscription}
//                                 className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium mt-2"
//                                 disabled={isCancelling}
//                               >
//                                 {isCancelling ? (
//                                   <LoadingSpinner size="sm" />
//                                 ) : (
//                                   "Cancel subscription"
//                                 )}
//                               </button>
//                             )}
//                           </>
//                         ) : subscriptionStatus.subscription.status ===
//                           "cancelled" ? (
//                           <p>
//                             Your subscription has been cancelled but will remain
//                             active until{" "}
//                             {new Date(
//                               subscriptionStatus.subscription.endDate || ""
//                             ).toLocaleDateString("en-US", {
//                               year: "numeric",
//                               month: "long",
//                               day: "numeric",
//                             })}
//                           </p>
//                         ) : (
//                           <p>
//                             Your subscription is{" "}
//                             {subscriptionStatus.subscription.status}.
//                           </p>
//                         )}
//                       </div>
//                     ) : (
//                       <p className="text-gray-600 dark:text-gray-300">
//                         Upgrade to premium for unlimited uploads and API access.
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Plans comparison */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//             {plans.map((plan) => (
//               <div
//                 key={plan.id}
//                 className={`card p-6 ${
//                   plan.id === "premium"
//                     ? "border-2 border-indigo-600 dark:border-indigo-500 relative"
//                     : ""
//                 }`}
//               >
//                 {plan.id === "premium" && (
//                   <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg dark:bg-indigo-500">
//                     Popular
//                   </div>
//                 )}

//                 <div className="text-center mb-6">
//                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//                     {plan.name}
//                   </h3>
//                   <div className="flex items-baseline justify-center">
//                     <span className="text-3xl font-bold text-gray-900 dark:text-white">
//                       {plan.currency === "INR" ? "₹" : "$"}
//                       {plan.price}
//                     </span>
//                     {plan.billingCycle && (
//                       <span className="text-gray-500 dark:text-gray-400 ml-1">
//                         /{plan.billingCycle}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 <ul className="space-y-3 mb-8">
//                   {plan.features.map((feature, index) => (
//                     <li key={index} className="flex items-start">
//                       <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-2 flex-shrink-0" />
//                       <span className="text-gray-600 dark:text-gray-300">
//                         {feature}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>

//                 <div>
//                   {plan.id === "premium" ? (
//                     <button
//                       onClick={() => handleSubscribe(plan.id)}
//                       disabled={isProcessing || isPremium}
//                       className={`btn w-full py-2.5 ${
//                         isPremium
//                           ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed"
//                           : "btn-primary"
//                       }`}
//                     >
//                       {isProcessing ? (
//                         <LoadingSpinner size="sm" />
//                       ) : isPremium ? (
//                         "Current Plan"
//                       ) : (
//                         <>
//                           Upgrade Now
//                           <ArrowRight className="ml-1 h-4 w-4" />
//                         </>
//                       )}
//                     </button>
//                   ) : (
//                     <button
//                       disabled={true}
//                       className="btn btn-outline w-full py-2.5"
//                     >
//                       Free Plan
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* FAQ section */}
//           <div className="mb-8">
//             <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
//               Frequently Asked Questions
//             </h2>

//             <div className="space-y-4">
//               <div className="card p-4">
//                 <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//                   How does billing work?
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-300">
//                   Premium plans are billed monthly. You'll be charged the
//                   subscription price at the beginning of each billing cycle.
//                 </p>
//               </div>

//               <div className="card p-4">
//                 <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//                   Can I cancel my subscription?
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-300">
//                   Yes, you can cancel your subscription at any time. You'll
//                   continue to have access to premium features until the end of
//                   your current billing period.
//                 </p>
//               </div>

//               <div className="card p-4">
//                 <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//                   What happens to my images if I downgrade?
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-300">
//                   If you downgrade from premium to free, you'll keep access to
//                   all your uploaded images. However, if you exceed the free plan
//                   limit, you won't be able to upload new images until you're
//                   below the limit again.
//                 </p>
//               </div>

//               <div className="card p-4">
//                 <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//                   What payment methods do you accept?
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-300">
//                   We accept credit/debit cards and UPI payments through our
//                   secure payment processor, Razorpay, in Indian Rupees (INR).
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Support section */}
//           <div className="card p-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
//             <div className="flex items-start">
//               <AlertCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-4 flex-shrink-0" />
//               <div>
//                 <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//                   Need help with your subscription?
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-300 mb-4">
//                   Our support team is available to assist you with any questions
//                   about plans or billing.
//                 </p>
//                 <a
//                   href="mailto:support@pixelvault.com"
//                   className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
//                 >
//                   Contact Support
//                 </a>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Upgrade;

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  CheckCircle,
  AlertCircle,
  Crown,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Star,
  Clock,
  CreditCard,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle?: string;
  features: string[];
}

interface SubscriptionStatus {
  plan: string;
  subscription: {
    status: string;
    startDate?: string;
    endDate?: string;
    daysLeft?: number;
  } | null;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Upgrade = () => {
  const { user, isPremium, refreshUser } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(new Set([0]));

  const toggleFAQ = (index: number) => {
    const newOpenFAQ = new Set(openFAQ);
    if (newOpenFAQ.has(index)) {
      newOpenFAQ.delete(index);
    } else {
      newOpenFAQ.add(index);
    }
    setOpenFAQ(newOpenFAQ);
  };

  const faqData = [
    // {
    //   icon: CreditCard,
    //   question: "How does billing work?",
    //   answer:
    //     "Premium plans are billed monthly with automatic renewal. You'll be charged at the beginning of each billing cycle with detailed invoices sent to your email.",
    // },
    {
      icon: Shield,
      question: "Can I cancel my subscription?",
      answer:
        "Absolutely! Cancel anytime with one click. You'll retain premium features until your current billing period ends - no immediate loss of access.",
    },
    {
      icon: Clock,
      question: "What happens to my images if I downgrade?",
      answer:
        "All your uploaded images remain safe and accessible forever. If you exceed free plan limits, you'll need to upgrade again to upload new content.",
    },
    {
      icon: Users,
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit/debit cards, UPI, net banking, and digital wallets through our secure payment partner Razorpay (INR only).",
    },
  ];

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await api.get("/api/plans");
        setPlans(data.plans);
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast.error("Failed to load subscription plans");
      }
    };

    const fetchSubscriptionStatus = async () => {
      try {
        const { data } = await api.get("/api/subscription/status");
        setSubscriptionStatus(data);
      } catch (error) {
        console.error("Error fetching subscription status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
    fetchSubscriptionStatus();
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (planId === "free") return;

    setIsProcessing(true);

    try {
      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () =>
            reject(new Error("Failed to load Razorpay checkout."));
          document.body.appendChild(script);
        });
      }

      // Create payment order
      const { data } = await api.post("/api/subscription/create-order", {
        orderId: Date.now().toString(36),
      });

      // Open Razorpay checkout
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "PixelVault",
        description: "Premium Subscription",
        order_id: data.order.id,
        handler: async function (response: any) {
          try {
            await api.post("/api/subscription/verify-payment", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            await refreshUser();
            const { data } = await api.get("/api/subscription/status");
            setSubscriptionStatus(data);

            toast.success("🎉 Welcome to Premium! Your upgrade is now active.");
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user?.username,
          email: user?.email,
        },
        theme: {
          color: "#6366F1",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to initiate payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !window.confirm(
        "Are you sure you want to cancel your subscription? You will still have premium access until the end of your billing period."
      )
    ) {
      return;
    }

    setIsCancelling(true);

    try {
      const { data } = await api.post("/api/subscription/cancel");
      toast.success(data.message);

      const response = await api.get("/api/subscription/status");
      setSubscriptionStatus(response.data);
      await refreshUser();
    } catch (error) {
      console.error("Cancellation error:", error);
      toast.error("Failed to cancel subscription");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl mb-8 shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Unlock the full potential of PixelVault with premium features
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-gray-500 dark:text-gray-400">
                Loading plans...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Current subscription status */}
            {subscriptionStatus && (
              <div className="max-w-4xl mx-auto mb-16">
                <div
                  className={`relative overflow-hidden rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-sm border ${
                    isPremium
                      ? "bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-purple-500/10 border-purple-300/30 dark:border-purple-700/30"
                      : "bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50"
                  }`}
                >
                  <div className="flex items-start space-x-6">
                    <div
                      className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                        isPremium
                          ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      <Crown className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        {isPremium ? "Premium Active" : "Free Plan"}
                      </h3>

                      {isPremium && subscriptionStatus?.subscription ? (
                        <div className="text-gray-600 dark:text-gray-300 space-y-2">
                          {subscriptionStatus.subscription.status ===
                          "active" ? (
                            <>
                              <p className="text-lg">
                                Your premium subscription is active until{" "}
                                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                  {new Date(
                                    subscriptionStatus.subscription.endDate ||
                                      ""
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                              </p>
                              {subscriptionStatus.subscription.daysLeft !==
                                undefined && (
                                <p className="text-sm bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 rounded-full inline-block">
                                  <Clock className="w-4 h-4 inline mr-1" />
                                  <span className="font-medium">
                                    {subscriptionStatus.subscription.daysLeft}
                                  </span>{" "}
                                  days remaining
                                </p>
                              )}
                              {subscriptionStatus.subscription.status !==
                                ("cancelled" as string) && (
                                <button
                                  onClick={handleCancelSubscription}
                                  className="mt-4 px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl font-medium transition-all duration-200 border border-red-200 dark:border-red-800"
                                  disabled={isCancelling}
                                >
                                  {isCancelling ? (
                                    <LoadingSpinner size="sm" />
                                  ) : (
                                    "Cancel subscription"
                                  )}
                                </button>
                              )}
                            </>
                          ) : subscriptionStatus.subscription.status ===
                            "cancelled" ? (
                            <p className="text-lg">
                              Your subscription has been cancelled but will
                              remain active until{" "}
                              <span className="font-semibold text-amber-600 dark:text-amber-400">
                                {new Date(
                                  subscriptionStatus.subscription.endDate || ""
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            </p>
                          ) : (
                            <p className="text-lg">
                              Your subscription is{" "}
                              <span className="font-semibold">
                                {subscriptionStatus.subscription.status}
                              </span>
                              .
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                          Upgrade to premium for unlimited uploads, API access,
                          and priority support.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Plans comparison */}
            <div className="max-w-6xl mx-auto mb-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative overflow-hidden rounded-3xl p-8 md:p-10 backdrop-blur-sm shadow-2xl transition-all duration-300 hover:scale-[1.02] ${
                      plan.id === "premium"
                        ? "bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-2 border-indigo-400/30 dark:border-indigo-500/30"
                        : "bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50"
                    }`}
                  >
                    {plan.id === "premium" && (
                      <>
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 text-sm font-semibold rounded-bl-2xl rounded-tr-3xl shadow-lg">
                          <Star className="w-4 h-4 inline mr-1" />
                          Most Popular
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
                      </>
                    )}

                    <div className="relative z-10">
                      <div className="text-center mb-8">
                        <div
                          className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg ${
                            plan.id === "premium"
                              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                          }`}
                        >
                          {plan.id === "premium" ? (
                            <Zap className="w-8 h-8" />
                          ) : (
                            <Users className="w-8 h-8" />
                          )}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                          {plan.name}
                        </h3>
                        <div className="flex items-baseline justify-center mb-2">
                          <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                            {plan.currency === "INR" ? "₹" : "$"}
                            {plan.price}
                          </span>
                          {plan.billingCycle && (
                            <span className="text-gray-500 dark:text-gray-400 ml-2 text-xl">
                              /{plan.billingCycle}
                            </span>
                          )}
                        </div>
                        {plan.id === "premium" && (
                          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                            Billed monthly • Cancel anytime
                          </p>
                        )}
                      </div>

                      <ul className="space-y-4 mb-10">
                        {plan.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div>
                        {plan.id === "premium" ? (
                          <button
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={isProcessing || isPremium}
                            className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl ${
                              isPremium
                                ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white transform hover:scale-105"
                            }`}
                          >
                            {isProcessing ? (
                              <LoadingSpinner size="sm" />
                            ) : isPremium ? (
                              <>
                                <Crown className="w-5 h-5 inline mr-2" />
                                Current Plan
                              </>
                            ) : (
                              <>
                                Upgrade to Premium
                                <ArrowRight className="w-5 h-5 inline ml-2" />
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            disabled={true}
                            className="w-full py-4 px-6 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl font-semibold text-lg cursor-not-allowed"
                          >
                            Current Plan
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Everything you need to know about subscriptions and billing
                </p>
              </div>

              <div className="space-y-4">
                {faqData.map((item, index) => {
                  const Icon = item.icon;
                  const isOpen = openFAQ.has(index);

                  return (
                    <div
                      key={index}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full p-6 text-left flex items-start gap-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-2xl"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                            {item.question}
                          </h3>
                        </div>

                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            )}
                          </div>
                        </div>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-6 pb-6 ml-16">
                          <div className="h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700 mb-4"></div>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Support section */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 md:p-12 shadow-2xl text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Need help with your subscription?
                </h3>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                  Our dedicated support team is available 24/7 to assist you
                  with any questions about plans, billing, or account
                  management.
                </p>
                <a
                  href="mailto:support@pixelvault.com"
                  className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Contact Support Team
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Upgrade;
