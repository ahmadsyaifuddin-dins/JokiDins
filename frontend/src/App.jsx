import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Dashboard from "./admin/Dashboard";
import AdminProfile from "./admin/Profile";
import AdminOrderDetail from "./admin/OrderDetail";
import AdminUserList from "./admin/AdminUserList";
import AdminUserDetail from "./admin/AdminUserDetail";
import AdminUserActivity from "./admin/UserActivity";
import IncomePage from "./admin/IncomePage";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import OrderList from "./pages/OrderList";
import OrderCreate from "./pages/OrderCreate";
import OrderEdit from "./pages/OrderEdit";
import OrderDetail from "./pages/OrderDetail";
import Contact from "./pages/Contact";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import VerifyEmail from "./components/VerifyEmail";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import { Toaster } from "react-hot-toast";
import AxiosInterceptorWrapper from "./wrappers/AxiosInterceptorWrapper";
import TokenAutoLogoutWrapper from "./wrappers/TokenAutoLogoutWrapper";
import MapComponent from "./components/home/MapComponent";
import PricingPage from "./pages/Pricing";
import DashboardPayment from "./admin/DashboardPayment";
import PaymentList from "./pages/PaymentList";
import TelegramLinkPageProfile from "./components/TelegramLinkPageProfile";


const App = () => {
  return (
    <Router>
      <TokenAutoLogoutWrapper />
      <AxiosInterceptorWrapper />
      <div className="min-h-screen flex flex-col bg-slate-950">
        <Navbar />
        <Toaster
          position="top-right"
          toastOptions={{
            className: "text-sm font-medium",
            duration: 3000,
            style: {
              background: "#ffffff",
              color: "#333333",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              borderRadius: "0.5rem",
            },
          }}
        />
        <main className="flex-grow mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/full-map" element={<MapComponent />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/DashboardPayment"
              element={
                <PrivateRoute>
                  <DashboardPayment />
                </PrivateRoute>
              }
            />
            <Route
              path="/pendapatan"
              element={
                <PrivateRoute>
                  <IncomePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <PrivateRoute>
                  <AdminProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/OrderDetail/:id"
              element={
                <PrivateRoute>
                  <AdminOrderDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateRoute>
                  <AdminUserList />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/userDetail/:id"
              element={
                <PrivateRoute>
                  <AdminUserDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/userActivity/:id"
              element={
                <PrivateRoute>
                  <AdminUserActivity />
                </PrivateRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/verify"
              element={
                <PublicRoute>
                  <VerifyEmail />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password/:token"
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/update-profile"
              element={
                <PrivateRoute>
                  <UpdateProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/OrderList"
              element={
                <PrivateRoute>
                  <OrderList />
                </PrivateRoute>
              }
            />
              <Route
                path="/payment"
                element={
                  <PrivateRoute>
                    <PaymentList />
                  </PrivateRoute>
                }
              />
            <Route
              path="/orderCreate"
              element={
                <PrivateRoute>
                  <OrderCreate />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-order/:id"
              element={
                <PrivateRoute>
                  <OrderEdit />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <PrivateRoute>
                  <OrderDetail />
                </PrivateRoute>
              }
            />
            <Route
            path="/TelegramLinkPageProfile"
            element={
              <PrivateRoute>
                <TelegramLinkPageProfile />
              </PrivateRoute>
            }
            />
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
