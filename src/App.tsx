/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout";

// Lazy Loading Pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Explore = lazy(() => import("./pages/Explore"));
const TripDetail = lazy(() => import("./pages/TripDetail"));
const DiscoverGuides = lazy(() => import("./pages/DiscoverGuides"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const DashboardLayout = lazy(() => import("./components/DashboardLayout"));
const MyBookings = lazy(() => import("./pages/dashboard/MyBookings"));
const Messages = lazy(() => import("./pages/dashboard/Messages"));
const GuideOverview = lazy(() => import("./pages/guide/Overview"));
const CreateTrip = lazy(() => import("./pages/guide/CreateTrip"));
const Analytics = lazy(() => import("./pages/guide/Analytics"));
const Safety = lazy(() => import("./pages/Safety"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ApplyGuide = lazy(() => import("./pages/guide/ApplyGuide"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const DashboardOverview = lazy(() => import("./pages/admin/DashboardOverview"));
const GuideApplications = lazy(() => import("./pages/admin/GuideApplications"));
const UsersPage = lazy(() => import("./pages/admin/Users"));
const TripsPage = lazy(() => import("./pages/admin/Trips"));
const BookingsPage = lazy(() => import("./pages/admin/Bookings"));
const ReviewsPage = lazy(() => import("./pages/admin/Reviews"));
const ActivityLogPage = lazy(() => import("./pages/admin/ActivityLog"));
const MapExplorer = lazy(() => import("./pages/MapExplorer"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const GuidePublicProfile = lazy(() => import("./pages/guide/PublicProfile"));
const ExplorerPublicProfile = lazy(() => import("./pages/ExplorerProfile"));
const UserProfileEdit = lazy(() => import("./pages/dashboard/Profile"));
const Offline = lazy(() => import("./pages/Offline"));
const Destinations = lazy(() => import("./pages/Destinations"));
const Blog = lazy(() => import("./pages/Blog"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SettingsPage = lazy(() => import("./pages/dashboard/Settings"));

import PWAManager from "./components/PWAManager";
import SEO from "./components/SEO";
import ScrollToTop from "./components/ScrollToTop";

import { ThemeProvider } from "./components/ThemeProvider";
import { NotificationProvider } from "./context/NotificationContext";
import { ChatProvider } from "./context/ChatContext";

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-gradient-mesh flex items-center justify-center z-[1000]">
    <div className="flex flex-col items-center gap-6">
      <div className="w-16 h-16 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
      <div className="text-[10px] font-black text-forest uppercase tracking-[0.4em] animate-pulse">Scanning Horizon...</div>
    </div>
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <NotificationProvider>
          <ChatProvider>
            <PWAManager />
            <SEO />
            <BrowserRouter>
              <ScrollToTop />
              <Suspense fallback={null}>
                <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="explore" element={<Explore />} />
          <Route path="map" element={<MapExplorer />} />
          <Route path="safety" element={<Safety />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="trip/:id" element={<TripDetail />} />
          <Route path="guides" element={<DiscoverGuides />} />
          <Route path="guide/:id" element={<GuidePublicProfile />} />
          <Route path="explorer/:id" element={<ExplorerPublicProfile />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="blog" element={<Blog />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="offline" element={<Offline />} />
        </Route>

        {/* Shared Dashboard Routes */}
        <Route element={<ProtectedRoute allowedRoles={["EXPLORER", "GUIDE"]} />}>
          <Route path="/dashboard/messages" element={<DashboardLayout><Messages /></DashboardLayout>} />
          <Route path="/dashboard/profile" element={<DashboardLayout><UserProfileEdit /></DashboardLayout>} />
          <Route path="/dashboard/settings" element={<DashboardLayout><SettingsPage /></DashboardLayout>} />
        </Route>

        {/* Explorer Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={["EXPLORER"]} />}>
          <Route path="/dashboard" element={<DashboardLayout><MyBookings /></DashboardLayout>} />
          <Route path="/dashboard/wishlist" element={<DashboardLayout><div className="p-10 text-center">Wishlist Coming Soon</div></DashboardLayout>} />
        </Route>

        {/* Guide Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={["GUIDE"]} />}>
          <Route path="/guide/dashboard" element={<DashboardLayout><GuideOverview /></DashboardLayout>} />
          <Route path="/guide/dashboard/trips" element={<DashboardLayout><div className="p-10 text-center">My Trips Coming Soon</div></DashboardLayout>} />
          <Route path="/guide/dashboard/create" element={<DashboardLayout><CreateTrip /></DashboardLayout>} />
          <Route path="/guide/dashboard/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
          <Route path="/guide/application" element={<ApplyGuide />} />
        </Route>

        {/* Admin Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="guide-applications" element={<GuideApplications />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="trips" element={<TripsPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="suspended" element={<UsersPage />} /> {/* Reuse UsersPage with filtered status */}
            <Route path="activity-log" element={<ActivityLogPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
        </BrowserRouter>
      </ChatProvider>
    </NotificationProvider>
  </ThemeProvider>
</HelmetProvider>
  );
}

