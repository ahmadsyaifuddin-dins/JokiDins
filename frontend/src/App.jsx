import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Dashboard from "./admin/Dashboard";
import AdminProfile from "./admin/Profile";
import AdminOrderDetail from "./admin/OrderDetail";
import OrderJoki from "./pages/OrderJoki";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import OrderList from './pages/OrderList';
import OrderCreate from './pages/OrderCreate';
import OrderEdit from './pages/OrderEdit';
import OrderDetail from './pages/OrderDetail';
import Contact from './pages/Contact';
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
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
            <Route path="/order" element={<OrderJoki />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
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
              path="/create-order"
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
              path="/admin/OrderDetail/:id"
              element={
                <PrivateRoute>
                  <AdminOrderDetail />
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
