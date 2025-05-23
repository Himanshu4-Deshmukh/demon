// import { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// import { CheckCircle, AlertCircle, Crown, ArrowRight } from 'lucide-react';
// import { api } from '../../lib/api';
// import { useAuth } from '../../context/AuthContext';
// import LoadingSpinner from '../../components/ui/LoadingSpinner';

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
//   const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isCancelling, setIsCancelling] = useState(false);

//   useEffect(() => {
//     const fetchPlans = async () => {
//       try {
//         const { data } = await api.get('/api/plans');
//         setPlans(data.plans);
//       } catch (error) {
//         console.error('Error fetching plans:', error);
//         toast.error('Failed to load subscription plans');
//       }
//     };

//     const fetchSubscriptionStatus = async () => {
//       try {
//         const { data } = await api.get('/api/subscription/status');
//         setSubscriptionStatus(data);
//       } catch (error) {
//         console.error('Error fetching subscription status:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPlans();
//     fetchSubscriptionStatus();
//   }, []);

//   const handleSubscribe = async (planId: string) => {
//     if (planId === 'free') {
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       // Load Razorpay script if not already loaded
//       if (!window.Razorpay) {
//         await new Promise<void>((resolve, reject) => {
//           const script = document.createElement('script');
//           script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//           script.onload = () => resolve();
//           script.onerror = () => reject(new Error('Failed to load Razorpay checkout.'));
//           document.body.appendChild(script);
//         });
//       }

//       // Create payment order
//       const { data } = await api.post('/api/subscription/create-order');

//       // Open Razorpay checkout
//       const options = {
//         key: data.key,
//         amount: data.order.amount,
//         currency: data.order.currency,
//         name: 'PixelVault',
//         description: 'Premium Subscription',
//         order_id: data.order.id,
//         handler: async function (response: any) {
//           try {
//             // Verify payment
//             await api.post('/api/subscription/verify-payment', {
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature,
//             });

//             // Refresh user data and subscription status
//             await refreshUser();
//             const { data } = await api.get('/api/subscription/status');
//             setSubscriptionStatus(data);

//             toast.success('Payment successful! You are now a premium user.');
//           } catch (error) {
//             console.error('Payment verification error:', error);
//             toast.error('Payment verification failed');
//           }
//         },
//         prefill: {
//           name: user?.username,
//           email: user?.email,
//         },
//         theme: {
//           color: '#4F46E5',
//         },
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
//     } catch (error) {
//       console.error('Subscription error:', error);
//       toast.error('Failed to initiate payment');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleCancelSubscription = async () => {
//     if (!window.confirm('Are you sure you want to cancel your subscription? You will still have premium access until the end of your billing period.')) {
//       return;
//     }

//     setIsCancelling(true);

//     try {
//       const { data } = await api.post('/api/subscription/cancel');

//       toast.success(data.message);

//       // Refresh subscription status
//       const response = await api.get('/api/subscription/status');
//       setSubscriptionStatus(response.data);

//       // Refresh user data
//       await refreshUser();
//     } catch (error) {
//       console.error('Cancellation error:', error);
//       toast.error('Failed to cancel subscription');
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
//               <div className={`card p-6 ${
//                 isPremium ? 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20' : ''
//               }`}>
//                 <div className="flex items-start">
//                   <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
//                     isPremium
//                       ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400'
//                       : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
//                   }`}>
//                     <Crown className="h-5 w-5" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
//                       Your current plan: {isPremium ? 'Premium' : 'Free'}
//                     </h3>

//                     {isPremium && subscriptionStatus?.subscription ? (
//                       <div className="text-gray-600 dark:text-gray-300">
//                         {subscriptionStatus.subscription.status === 'active' ? (
//                           <>
//                             <p>
//                               Your premium subscription is active until{' '}
//                               {new Date(subscriptionStatus.subscription.endDate || '').toLocaleDateString('en-US', {
//                                 year: 'numeric',
//                                 month: 'long',
//                                 day: 'numeric',
//                               })}
//                             </p>
//                             {subscriptionStatus.subscription.daysLeft !== undefined && (
//                               <p className="mt-1">
//                                 <span className="font-medium">{subscriptionStatus.subscription.daysLeft}</span> days remaining
//                               </p>
//                             )}
//                             {subscriptionStatus.subscription.status !== 'cancelled' && (
//                               <button
//                                 onClick={handleCancelSubscription}
//                                 className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium mt-2"
//                                 disabled={isCancelling}
//                               >
//                                 {isCancelling ? <LoadingSpinner size="sm" /> : 'Cancel subscription'}
//                               </button>
//                             )}
//                           </>
//                         ) : subscriptionStatus.subscription.status === 'cancelled' ? (
//                           <p>
//                             Your subscription has been cancelled but will remain active until{' '}
//                             {new Date(subscriptionStatus.subscription.endDate || '').toLocaleDateString('en-US', {
//                               year: 'numeric',
//                               month: 'long',
//                               day: 'numeric',
//                             })}
//                           </p>
//                         ) : (
//                           <p>Your subscription is {subscriptionStatus.subscription.status}.</p>
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
//                   plan.id === 'premium' ? 'border-2 border-indigo-600 dark:border-indigo-500 relative' : ''
//                 }`}
//               >
//                 {plan.id === 'premium' && (
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
//                       {plan.currency === 'INR' ? '₹' : '$'}{plan.price}
//                     </span>
//                     {plan.billingCycle && (
//                       <span className="text-gray-500 dark:text-gray-400 ml-1">/{plan.billingCycle}</span>
//                     )}
//                   </div>
//                 </div>

//                 <ul className="space-y-3 mb-8">
//                   {plan.features.map((feature, index) => (
//                     <li key={index} className="flex items-start">
//                       <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-2 flex-shrink-0" />
//                       <span className="text-gray-600 dark:text-gray-300">{feature}</span>
//                     </li>
//                   ))}
//                 </ul>

//                 <div>
//                   {plan.id === 'premium' ? (
//                     <button
//                       onClick={() => handleSubscribe(plan.id)}
//                       disabled={isProcessing || isPremium}
//                       className={`btn w-full py-2.5 ${
//                         isPremium
//                           ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed'
//                           : 'btn-primary'
//                       }`}
//                     >
//                       {isProcessing ? (
//                         <LoadingSpinner size="sm" />
//                       ) : isPremium ? (
//                         'Current Plan'
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
//                   Premium plans are billed monthly. You'll be charged the subscription price at the beginning of each billing cycle.
//                 </p>
//               </div>

//               <div className="card p-4">
//                 <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//                   Can I cancel my subscription?
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-300">
//                   Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your current billing period.
//                 </p>
//               </div>

//               <div className="card p-4">
//                 <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//                   What happens to my images if I downgrade?
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-300">
//                   If you downgrade from premium to free, you'll keep access to all your uploaded images. However, if you exceed the free plan limit, you won't be able to upload new images until you're below the limit again.
//                 </p>
//               </div>

//               <div className="card p-4">
//                 <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//                   What payment methods do you accept?
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-300">
//                   We accept credit/debit cards and UPI payments through our secure payment processor, Razorpay, in Indian Rupees (INR).
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
//                   Our support team is available to assist you with any questions about plans or billing.
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
import { CheckCircle, AlertCircle, Crown, ArrowRight } from "lucide-react";
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
    if (planId === "free") {
      return;
    }

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
        orderId: Date.now().toString(36), // Generate a shorter order ID
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
            // Verify payment
            await api.post("/api/subscription/verify-payment", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Refresh user data and subscription status
            await refreshUser();
            const { data } = await api.get("/api/subscription/status");
            setSubscriptionStatus(data);

            toast.success("Payment successful! You are now a premium user.");
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
          color: "#4F46E5",
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

      // Refresh subscription status
      const response = await api.get("/api/subscription/status");
      setSubscriptionStatus(response.data);

      // Refresh user data
      await refreshUser();
    } catch (error) {
      console.error("Cancellation error:", error);
      toast.error("Failed to cancel subscription");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Subscription Plans
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Choose the plan that's right for you
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {/* Current subscription status */}
          {subscriptionStatus && (
            <div className="mb-8">
              <div
                className={`card p-6 ${
                  isPremium
                    ? "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20"
                    : ""
                }`}
              >
                <div className="flex items-start">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
                      isPremium
                        ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    <Crown className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                      Your current plan: {isPremium ? "Premium" : "Free"}
                    </h3>

                    {isPremium && subscriptionStatus?.subscription ? (
                      <div className="text-gray-600 dark:text-gray-300">
                        {subscriptionStatus.subscription.status === "active" ? (
                          <>
                            <p>
                              Your premium subscription is active until{" "}
                              {new Date(
                                subscriptionStatus.subscription.endDate || ""
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            {subscriptionStatus.subscription.daysLeft !==
                              undefined && (
                              <p className="mt-1">
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
                                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium mt-2"
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
                          <p>
                            Your subscription has been cancelled but will remain
                            active until{" "}
                            {new Date(
                              subscriptionStatus.subscription.endDate || ""
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        ) : (
                          <p>
                            Your subscription is{" "}
                            {subscriptionStatus.subscription.status}.
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-300">
                        Upgrade to premium for unlimited uploads and API access.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Plans comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`card p-6 ${
                  plan.id === "premium"
                    ? "border-2 border-indigo-600 dark:border-indigo-500 relative"
                    : ""
                }`}
              >
                {plan.id === "premium" && (
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg dark:bg-indigo-500">
                    Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {plan.currency === "INR" ? "₹" : "$"}
                      {plan.price}
                    </span>
                    {plan.billingCycle && (
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        /{plan.billingCycle}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-2 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">
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
                      className={`btn w-full py-2.5 ${
                        isPremium
                          ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed"
                          : "btn-primary"
                      }`}
                    >
                      {isProcessing ? (
                        <LoadingSpinner size="sm" />
                      ) : isPremium ? (
                        "Current Plan"
                      ) : (
                        <>
                          Upgrade Now
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      disabled={true}
                      className="btn btn-outline w-full py-2.5"
                    >
                      Free Plan
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* FAQ section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div className="card p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  How does billing work?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Premium plans are billed monthly. You'll be charged the
                  subscription price at the beginning of each billing cycle.
                </p>
              </div>

              <div className="card p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Can I cancel my subscription?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, you can cancel your subscription at any time. You'll
                  continue to have access to premium features until the end of
                  your current billing period.
                </p>
              </div>

              <div className="card p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  What happens to my images if I downgrade?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  If you downgrade from premium to free, you'll keep access to
                  all your uploaded images. However, if you exceed the free plan
                  limit, you won't be able to upload new images until you're
                  below the limit again.
                </p>
              </div>

              <div className="card p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We accept credit/debit cards and UPI payments through our
                  secure payment processor, Razorpay, in Indian Rupees (INR).
                </p>
              </div>
            </div>
          </div>

          {/* Support section */}
          <div className="card p-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Need help with your subscription?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Our support team is available to assist you with any questions
                  about plans or billing.
                </p>
                <a
                  href="mailto:support@pixelvault.com"
                  className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Upgrade;
