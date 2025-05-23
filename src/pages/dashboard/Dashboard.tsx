// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import {
//   ImagePlus,
//   TrendingUp,
//   Zap,
//   HardDrive,
//   ArrowRight,
// } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";
// import { api } from "../../lib/api";
// import LoadingSpinner from "../../components/ui/LoadingSpinner";

// interface UserStats {
//   totalImages: number;
//   totalStorageMB: string;
//   monthlyUploads: number;
//   uploadTrends: { date: string; count: number }[];
//   plan: string;
//   limits: {
//     maxImages: number | string;
//     remaining?: number;
//   };
// }

// const Dashboard = () => {
//   const { user, isPremium } = useAuth();
//   const [stats, setStats] = useState<UserStats | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [recentImages, setRecentImages] = useState<any[]>([]);
//   const [recentImagesLoading, setRecentImagesLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const { data } = await api.get("/api/user/stats");
//         setStats(data);
//       } catch (error) {
//         console.error("Error fetching stats:", error);
//         toast.error("Failed to load dashboard stats");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const fetchRecentImages = async () => {
//       try {
//         const { data } = await api.get("/api/images?limit=6");
//         setRecentImages(data.images);
//       } catch (error) {
//         console.error("Error fetching recent images:", error);
//       } finally {
//         setRecentImagesLoading(false);
//       }
//     };

//     fetchStats();
//     fetchRecentImages();
//   }, []);

//   const maxValue =
//     (stats?.uploadTrends ?? []).length > 0
//       ? Math.max(...(stats?.uploadTrends?.map((t) => t.count) || []))
//       : 0;

//   return (
//     <div className="fade-in">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//           Welcome back, {user?.username}!
//         </h1>
//         <p className="text-gray-600 dark:text-gray-300">
//           Here's an overview of your account and recent activity.
//         </p>
//       </div>

//       {/* Stats cards */}
//       {isLoading ? (
//         <div className="flex justify-center py-12">
//           <LoadingSpinner size="lg" />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="card p-6">
//             <div className="flex items-start justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
//                   Total Images
//                 </p>
//                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {stats?.totalImages || 0}
//                 </h3>
//               </div>
//               <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400">
//                 <ImagePlus className="h-5 w-5" />
//               </div>
//             </div>
//             {!isPremium && (
//               <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
//                 {stats?.limits?.remaining} / {stats?.limits?.maxImages}{" "}
//                 remaining
//                 <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 dark:bg-gray-700">
//                   <div
//                     className="h-1.5 bg-indigo-600 rounded-full dark:bg-indigo-500"
//                     style={{
//                       width: `${
//                         stats?.totalImages &&
//                         stats?.limits?.maxImages !== "Unlimited"
//                           ? (stats.totalImages /
//                               (stats.limits.maxImages as number)) *
//                             100
//                           : 0
//                       }%`,
//                     }}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="card p-6">
//             <div className="flex items-start justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
//                   Storage Used
//                 </p>
//                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {stats?.totalStorageMB || "0"} MB
//                 </h3>
//               </div>
//               <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
//                 <HardDrive className="h-5 w-5" />
//               </div>
//             </div>
//           </div>

//           <div className="card p-6">
//             <div className="flex items-start justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
//                   This Month
//                 </p>
//                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {stats?.monthlyUploads || 0}
//                 </h3>
//               </div>
//               <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 dark:bg-amber-900 dark:text-amber-400">
//                 <TrendingUp className="h-5 w-5" />
//               </div>
//             </div>
//           </div>

//           <div className="card p-6">
//             <div className="flex items-start justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
//                   Account Type
//                 </p>
//                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {isPremium ? "Premium" : "Free"}
//                 </h3>
//               </div>
//               <div
//                 className={`h-10 w-10 rounded-full flex items-center justify-center ${
//                   isPremium
//                     ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400"
//                     : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
//                 }`}
//               >
//                 <Zap className="h-5 w-5" />
//               </div>
//             </div>
//             {!isPremium && (
//               <div className="mt-3">
//                 <Link
//                   to="/upgrade"
//                   className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
//                 >
//                   Upgrade to Premium
//                   <ArrowRight className="inline-block ml-1 h-3 w-3" />
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         {/* Weekly upload trend */}
//         <div className="card p-6 lg:col-span-2">
//           <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
//             Upload Activity
//           </h3>
//           {isLoading ? (
//             <div className="flex justify-center py-8">
//               <LoadingSpinner />
//             </div>
//           ) : (
//             <div className="h-64">
//               {stats?.uploadTrends && stats.uploadTrends.length > 0 ? (
//                 <div className="flex h-full items-end">
//                   {stats.uploadTrends.map((day) => (
//                     <div
//                       key={day.date}
//                       className="flex-1 flex flex-col items-center"
//                     >
//                       <div
//                         className="w-full max-w-[40px] bg-indigo-600 dark:bg-indigo-500 rounded-t-md transition-all duration-500"
//                         style={{
//                           height: `${
//                             maxValue > 0 ? (day.count / maxValue) * 100 : 0
//                           }%`,
//                           opacity: day.count > 0 ? 1 : 0.3,
//                         }}
//                       />
//                       <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
//                         {new Date(day.date).toLocaleDateString("en-US", {
//                           weekday: "short",
//                         })}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
//                   No upload data available yet.
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Account summary */}
//         <div className="card p-6">
//           <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
//             Account Summary
//           </h3>
//           <div className="space-y-4">
//             <div>
//               <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
//                 Username
//               </p>
//               <p className="text-gray-900 dark:text-white">{user?.username}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
//                 Email
//               </p>
//               <p className="text-gray-900 dark:text-white">{user?.email}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
//                 Plan
//               </p>
//               <p className="text-gray-900 dark:text-white flex items-center">
//                 {isPremium ? (
//                   <>
//                     <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
//                       Premium
//                     </span>
//                     <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
//                       (Active)
//                     </span>
//                   </>
//                 ) : (
//                   <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
//                     Free
//                   </span>
//                 )}
//               </p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
//                 Account created
//               </p>
//               <p className="text-gray-900 dark:text-white">
//                 {new Date().toLocaleDateString("en-US", {
//                   year: "numeric",
//                   month: "long",
//                   day: "numeric",
//                 })}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent uploads */}
//       <div className="mb-4 flex items-center justify-between">
//         <h3 className="text-lg font-medium text-gray-900 dark:text-white">
//           Recent Uploads
//         </h3>
//         <Link
//           to="/gallery"
//           className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center"
//         >
//           View all
//           <ArrowRight className="ml-1 h-4 w-4" />
//         </Link>
//       </div>

//       {recentImagesLoading ? (
//         <div className="flex justify-center py-12">
//           <LoadingSpinner />
//         </div>
//       ) : recentImages.length > 0 ? (
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//           {recentImages.map((image) => (
//             <div key={image.id} className="card overflow-hidden group">
//               <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative">
//                 <img
//                   src={image.url}
//                   alt={image.originalName}
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
//                   <Link
//                     to={`/gallery?selected=${image.id}`}
//                     className="p-1 rounded-full bg-white text-gray-900"
//                   >
//                     <ArrowRight className="h-4 w-4" />
//                   </Link>
//                 </div>
//               </div>
//               <div className="p-2">
//                 <p
//                   className="text-xs text-gray-500 dark:text-gray-400 truncate"
//                   title={image.originalName}
//                 >
//                   {image.originalName}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12 bg-gray-50 rounded-lg dark:bg-gray-800">
//           <ImagePlus className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//             No images yet
//           </h3>
//           <p className="text-gray-500 dark:text-gray-400 mb-4">
//             Upload your first image to get started
//           </p>
//           <Link to="/gallery" className="btn btn-primary">
//             Upload an Image
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import {
//   ImagePlus,
//   TrendingUp,
//   Zap,
//   HardDrive,
//   ArrowRight,
// } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";
// import { api } from "../../lib/api";
// import LoadingSpinner from "../../components/ui/LoadingSpinner";

// interface UserStats {
//   totalImages: number;
//   totalStorageMB: string;
//   monthlyUploads: number;
//   uploadTrends: { date: string; count: number }[];
//   plan: string;
//   limits: {
//     maxImages: number | string;
//     remaining?: number;
//   };
// }

// const Dashboard = () => {
//   const { user, isPremium } = useAuth();
//   const [stats, setStats] = useState<UserStats | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [recentImages, setRecentImages] = useState<any[]>([]);
//   const [recentImagesLoading, setRecentImagesLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const { data } = await api.get("/api/user/stats");
//         console.log("Stats data:", data);
//         setStats(data);
//       } catch (error) {
//         console.error("Error fetching stats:", error);
//         toast.error("Failed to load dashboard stats");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const fetchRecentImages = async () => {
//       try {
//         const { data } = await api.get("/api/images?limit=6");
//         setRecentImages(data.images);
//       } catch (error) {
//         console.error("Error fetching recent images:", error);
//       } finally {
//         setRecentImagesLoading(false);
//       }
//     };

//     fetchStats();
//     fetchRecentImages();
//   }, []);

//   const maxValue =
//     (stats?.uploadTrends ?? []).length > 0
//       ? Math.max(...(stats?.uploadTrends?.map((t) => t.count) || []))
//       : 0;

//   return (
//     <div className="fade-in">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//           Welcome back, {user?.username}!
//         </h1>
//         <p className="text-gray-600 dark:text-gray-300">
//           Here's an overview of your account and recent activity.
//         </p>
//       </div>

//       {/* Stats cards */}
//       {isLoading ? (
//         <div className="flex justify-center py-12">
//           <LoadingSpinner size="lg" />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="card p-6">
//             <div className="flex items-start justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
//                   Total Images
//                 </p>
//                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {stats?.totalImages || 0}
//                 </h3>
//               </div>
//               <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400">
//                 <ImagePlus className="h-5 w-5" />
//               </div>
//             </div>
//             {!isPremium && (
//               <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
//                 {stats?.limits?.remaining} / {stats?.limits?.maxImages}{" "}
//                 remaining
//                 <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 dark:bg-gray-700">
//                   <div
//                     className="h-1.5 bg-indigo-600 rounded-full dark:bg-indigo-500"
//                     style={{
//                       width: `${
//                         stats?.totalImages &&
//                         stats?.limits?.maxImages !== "Unlimited"
//                           ? (stats.totalImages /
//                               (stats.limits.maxImages as number)) *
//                             100
//                           : 0
//                       }%`,
//                     }}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="card p-6">
//             <div className="flex items-start justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
//                   Storage Used
//                 </p>
//                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {stats?.totalStorageMB || "0"} MB
//                 </h3>
//               </div>
//               <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
//                 <HardDrive className="h-5 w-5" />
//               </div>
//             </div>
//           </div>

//           <div className="card p-6">
//             <div className="flex items-start justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
//                   This Month
//                 </p>
//                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {stats?.monthlyUploads || 0}
//                 </h3>
//               </div>
//               <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 dark:bg-amber-900 dark:text-amber-400">
//                 <TrendingUp className="h-5 w-5" />
//               </div>
//             </div>
//           </div>

//           <div className="card p-6">
//             <div className="flex items-start justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
//                   Account Type
//                 </p>
//                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {isPremium ? "Premium" : "Free"}
//                 </h3>
//               </div>
//               <div
//                 className={`h-10 w-10 rounded-full flex items-center justify-center ${
//                   isPremium
//                     ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400"
//                     : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
//                 }`}
//               >
//                 <Zap className="h-5 w-5" />
//               </div>
//             </div>
//             {!isPremium && (
//               <div className="mt-3">
//                 <Link
//                   to="/upgrade"
//                   className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
//                 >
//                   Upgrade to Premium
//                   <ArrowRight className="inline-block ml-1 h-3 w-3" />
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         {/* Weekly upload trend */}
//         <div className="card p-6 lg:col-span-2">
//           <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
//             Upload Activity
//           </h3>
//           {isLoading ? (
//             <div className="flex justify-center py-8">
//               <LoadingSpinner />
//             </div>
//           ) : (
//             <div className="h-64">
//               {stats?.uploadTrends && stats.uploadTrends.length > 0 ? (
//                 <div className="flex h-full items-end">
//                   {stats.uploadTrends.map((day) => (
//                     <div
//                       key={day.date}
//                       className="flex-1 flex flex-col items-center"
//                     >
//                       <div
//                         className="w-full max-w-[40px] bg-indigo-600 dark:bg-indigo-500 rounded-t-md transition-all duration-500"
//                         style={{
//                           height: `${
//                             maxValue > 0 ? (day.count / maxValue) * 100 : 0
//                           }%`,
//                           opacity: day.count > 0 ? 1 : 0.3,
//                         }}
//                       />
//                       <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
//                         {new Date(day.date).toLocaleDateString("en-US", {
//                           weekday: "short",
//                         })}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
//                   No upload data available yet.
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Account summary */}
//         <div className="card p-6">
//           <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
//             Account Summary
//           </h3>
//           <div className="space-y-4">
//             <div>
//               <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
//                 Username
//               </p>
//               <p className="text-gray-900 dark:text-white">{user?.username}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
//                 Email
//               </p>
//               <p className="text-gray-900 dark:text-white">{user?.email}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
//                 Plan
//               </p>
//               <p className="text-gray-900 dark:text-white flex items-center">
//                 {isPremium ? (
//                   <>
//                     <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
//                       Premium
//                     </span>
//                     <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
//                       (Active)
//                     </span>
//                   </>
//                 ) : (
//                   <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
//                     Free
//                   </span>
//                 )}
//               </p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
//                 Account created
//               </p>
//               <p className="text-gray-900 dark:text-white">
//                 {new Date().toLocaleDateString("en-US", {
//                   year: "numeric",
//                   month: "long",
//                   day: "numeric",
//                 })}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent uploads */}
//       <div className="mb-4 flex items-center justify-between">
//         <h3 className="text-lg font-medium text-gray-900 dark:text-white">
//           Recent Uploads
//         </h3>
//         <Link
//           to="/gallery"
//           className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center"
//         >
//           View all
//           <ArrowRight className="ml-1 h-4 w-4" />
//         </Link>
//       </div>

//       {recentImagesLoading ? (
//         <div className="flex justify-center py-12">
//           <LoadingSpinner />
//         </div>
//       ) : recentImages.length > 0 ? (
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//           {recentImages.map((image) => (
//             <div key={image.id} className="card overflow-hidden group">
//               <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative">
//                 <img
//                   src={image.url}
//                   alt={image.originalName}
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
//                   <Link
//                     to={`/gallery?selected=${image.id}`}
//                     className="p-1 rounded-full bg-white text-gray-900"
//                   >
//                     <ArrowRight className="h-4 w-4" />
//                   </Link>
//                 </div>
//               </div>
//               <div className="p-2">
//                 <p
//                   className="text-xs text-gray-500 dark:text-gray-400 truncate"
//                   title={image.originalName}
//                 >
//                   {image.originalName}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12 bg-gray-50 rounded-lg dark:bg-gray-800">
//           <ImagePlus className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//             No images yet
//           </h3>
//           <p className="text-gray-500 dark:text-gray-400 mb-4">
//             Upload your first image to get started
//           </p>
//           <Link to="/gallery" className="btn btn-primary">
//             Upload an Image
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ImagePlus,
  TrendingUp,
  Zap,
  HardDrive,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

interface UserStats {
  totalImages: number;
  totalStorageMB: string;
  monthlyUploads: number;
  uploadTrends: { date: string; count: number }[];
  plan: string;
  limits: {
    maxImages: number | string;
    remaining?: number;
  };
}

const Dashboard = () => {
  const { user, isPremium } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentImages, setRecentImages] = useState<any[]>([]);
  const [recentImagesLoading, setRecentImagesLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/api/user/stats");

        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load dashboard stats");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRecentImages = async () => {
      try {
        const { data } = await api.get("/api/images?limit=6");
        setRecentImages(data.images);
      } catch (error) {
        console.error("Error fetching recent images:", error);
      } finally {
        setRecentImagesLoading(false);
      }
    };

    fetchStats();
    fetchRecentImages();
  }, []);

  const maxValue =
    (stats?.uploadTrends ?? []).length > 0
      ? Math.max(...(stats?.uploadTrends?.map((t) => t.count) || []), 1) // Ensure minimum of 1 for scaling
      : 1;

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Here's an overview of your account and recent activity.
        </p>
      </div>

      {/* Stats cards */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Total Images
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalImages || 0}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400">
                <ImagePlus className="h-5 w-5" />
              </div>
            </div>
            {!isPremium && (
              <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                {stats?.limits?.remaining} / {stats?.limits?.maxImages}{" "}
                remaining
                <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 dark:bg-gray-700">
                  <div
                    className="h-1.5 bg-indigo-600 rounded-full dark:bg-indigo-500"
                    style={{
                      width: `${
                        stats?.totalImages &&
                        stats?.limits?.maxImages !== "Unlimited"
                          ? (stats.totalImages /
                              (stats.limits.maxImages as number)) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Storage Used
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalStorageMB || "0"} MB
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
                <HardDrive className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  This Month
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.monthlyUploads || 0}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 dark:bg-amber-900 dark:text-amber-400">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Account Type
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isPremium ? "Premium" : "Free"}
                </h3>
              </div>
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  isPremium
                    ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                <Zap className="h-5 w-5" />
              </div>
            </div>
            {!isPremium && (
              <div className="mt-3">
                <Link
                  to="/upgrade"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Upgrade to Premium
                  <ArrowRight className="inline-block ml-1 h-3 w-3" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly upload trend */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Upload Activity
          </h3>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="h-64">
              {stats?.uploadTrends && stats.uploadTrends.length > 0 ? (
                <div className="flex h-full items-end justify-center space-x-2">
                  {stats.uploadTrends.map((day) => (
                    <div
                      key={day.date}
                      className="flex flex-col items-center flex-1 max-w-[60px]"
                    >
                      <div className="relative w-full h-48 flex items-end">
                        <div
                          className={`w-full rounded-t-md transition-all duration-500 ${
                            day.count > 0
                              ? "bg-indigo-600 dark:bg-indigo-500"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                          style={{
                            height: `${
                              day.count > 0
                                ? Math.max((day.count / maxValue) * 100, 8) // Minimum 8% height for visibility
                                : 4 // Small height for zero values
                            }%`,
                          }}
                        />
                        {day.count > 0 && (
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 dark:text-gray-300">
                            {day.count}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        {new Date(day.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  No upload data available yet.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account summary */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Account Summary
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Username
              </p>
              <p className="text-gray-900 dark:text-white">{user?.username}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Email
              </p>
              <p className="text-gray-900 dark:text-white">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Plan
              </p>
              <p className="text-gray-900 dark:text-white flex items-center">
                {isPremium ? (
                  <>
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
                      Premium
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      (Active)
                    </span>
                  </>
                ) : (
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                    Free
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Account created
              </p>
              <p className="text-gray-900 dark:text-white">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent uploads */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Recent Uploads
        </h3>
        <Link
          to="/gallery"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center"
        >
          View all
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      {recentImagesLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : recentImages.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {recentImages.map((image) => (
            <div key={image.id} className="card overflow-hidden group">
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative">
                <img
                  src={image.url}
                  alt={image.originalName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Link
                    to={`/gallery?selected=${image.id}`}
                    className="p-1 rounded-full bg-white text-gray-900"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="p-2">
                <p
                  className="text-xs text-gray-500 dark:text-gray-400 truncate"
                  title={image.originalName}
                >
                  {image.originalName}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg dark:bg-gray-800">
          <ImagePlus className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No images yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Upload your first image to get started
          </p>
          <Link to="/gallery" className="btn btn-primary">
            Upload an Image
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
