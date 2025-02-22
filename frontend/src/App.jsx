import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardUser from "./pages/DashboardUser";
import OrderJoki from "./pages/OrderJoki";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import OrderList from './pages/OrderList';
import OrderCreate from './pages/OrderCreate';
import OrderDetail from './pages/OrderDetail';
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<DashboardUser />} />
            <Route path="/order" element={<OrderJoki />} />
            <Route path="/adminPanel" element={<AdminPanel />} />
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
          path="/orders" 
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
        <Route path="/orders/:id" 
        element={
          <PrivateRoute>
            <OrderDetail />
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