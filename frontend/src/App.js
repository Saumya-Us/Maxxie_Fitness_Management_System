import { createTheme, ThemeProvider } from "@mui/material";
import { useState, lazy } from 'react';
import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import palette from "./theme/palette";
import typography from "./theme/typography";
import "./App.css";

// Existing components
import WorkoutPlan from './components/WorkoutPlan';
import DietPlan from './components/DietPlan';
import MembershipPlan from './components/MembershipPlan';
import MembershipPlanUser from './components/MembershipPlansUser';
import WorkoutPlanUser from './components/WorkoutPlanUser';
import DietPlanUser from "./components/DietPlanUser";

// New member components
import AdminDashboard from "./pages/AdminDashboard";
import UserStore from "./pages/UserStore";
import Cart from "./pages/Cart";
import AddSupplement from "./pages/AddSupplement";
import EditSupplement from "./pages/EditSupplement";
import ProductDetail from './pages/ProductDetail';
import InventoryReport from "./pages/InventoryReport";
import SupplimentHome from "./pages/SupplimentHome";
import Dashboard from "./pages/Dashboard";
import Gymhome from "./pages/GymHome";

// Protected route and layouts
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Layout1 from "./Layout/layout1";
import Layout2 from "./Layout/layout2";
import HomeLayout from "./Layout/homeLayout";
import PaymentPage from "./pages/PaymentPage";

import AdminAppointments from './pages/AdminAppointments';
import AddSession from './pages/AddSession';
import ViewSessions from './pages/ViewSessions';
import EditAppointment from './pages/EditAppointment';
import EditSession from './pages/EditSession';
import PersonalTraining from './pages/PersonalTraining';
import GroupClass from './pages/GroupClass';
import Yoga from './pages/Yoga';
import CrossFit from './pages/CrossFit';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointment';
import ViewAppointment from './pages/ViewAppointment';
import SessionHome from './pages/SessionHome';
import AllSessions from './pages/AllSessions';
import FinancialDashboard from "./pages/FinancialDashboard";
import Payments from "./pages/Payments";
import Expenses from "./pages/Expenses";
import Checkout from "./pages/Checkout";
import PaymentHistory from "./pages/PaymentHistory";
import OrderConfirmation from './pages/OrderConfirmation';

// Lazy-loaded pages for other functionalities
const Login = lazy(() => import("./pages/Login/login"));
const Register = lazy(() => import("./pages/Register/register"));
const Home = lazy(() => import("./pages/Home/home"));
const Item01 = lazy(() => import("./pages/Item01/item01"));
const Userinfo = lazy(() => import("./pages/Admin/Userinfo/userinfo"));
const Profile = lazy(() => import("./pages/Profile/profile"));
const Test = lazy(() => import("./pages/Test/test"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/Reset_Password/ResetPassword"));

const theme = createTheme({
  palette: palette.light,
  typography,
});

// --- Cart logic lifted to App ---
function App() {
  const [cart, setCart] = useState([]);

  // Add item to cart
  const addToCart = (supplement) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === supplement._id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + (supplement.quantity || 1);
        if (newQuantity > supplement.stock) {
          return prevCart.map(item =>
            item._id === supplement._id
              ? { ...item, quantity: supplement.stock }
              : item
          );
        }
        return prevCart.map(item =>
          item._id === supplement._id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      const safeQuantity = Math.min(supplement.quantity || 1, supplement.stock);
      return [...prevCart, { ...supplement, quantity: safeQuantity }];
    });
  };

  // Remove item from cart
  const removeFromCart = (supplementId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== supplementId));
  };

  // Update quantity in cart
  const updateCartQuantity = (supplementId, quantity) => {
    if (quantity < 1) {
      removeFromCart(supplementId);
      return;
    }
    setCart(prevCart => {
      const item = prevCart.find(item => item._id === supplementId);
      if (!item) return prevCart;
      const safeQuantity = Math.min(quantity, item.stock);
      return prevCart.map(item =>
        item._id === supplementId
          ? { ...item, quantity: safeQuantity }
          : item
      );
    });
  };

  // Wrappers using shared cart logic
  function UserStoreWrapper() {
    return <UserStore addToCart={addToCart} cartItems={cart} />;
  }

  function CartWrapper() {
    return (
      <Cart
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateCartQuantity}
      />
    );
  }

  function ProductDetailWrapper() {
    return <ProductDetail addToCart={addToCart} />;
  }

  function WorkoutPlanWrapper() {
    const [showPopup, setShowPopup] = useState(false);
    return <WorkoutPlan showPopup={showPopup} setShowPopup={setShowPopup} />;
  }

  function DietPlanWrapper() {
    const [showPopup, setShowPopup] = useState(false);
    return <DietPlan showPopup={showPopup} setShowPopup={setShowPopup} />;
  }

  function MembershipPlanWrapper() {
    const [showPopup, setShowPopup] = useState(false);
    return <MembershipPlan showPopup={showPopup} setShowPopup={setShowPopup} />;
  }

  function CheckoutWrapper() {
    const userId = localStorage.getItem('userId');
    return <Checkout userId={userId} />;
  }

  // Router using wrappers with shared cart
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Gymhome />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password/:id/:token",
      element: <ResetPassword />,
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute allowedRoles={["member", "admin"]}>
          <Profile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/",
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <Layout2 />
        </ProtectedRoute>
      ),
      children: [
        { path: "financial-dashboard", element: <FinancialDashboard /> },
        { path: "payments", element: <Payments /> },
        { path: "expenses", element: <Expenses /> },
        { path: "userinfo", element: <Userinfo /> },
      ],
    },
    {
      path: "/",
      element: (
        <ProtectedRoute allowedRoles={["member"]}>
          <Layout1 />
        </ProtectedRoute>
      ),
      children: [
        { path: "checkout", element: <CheckoutWrapper /> },
        { path: "payment-history", element: <PaymentHistory /> },
        { path: "session", element: <Item01 /> },
        { path: "store", element: <Test /> },
      ],
    },
    {
      path: "/",
      element: (
        <ProtectedRoute allowedRoles={["member"]}>
          <HomeLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "home",
          element: <Home />,
        },
      ],
    },
    {
      path: "/workout-plans",
      element: <WorkoutPlanWrapper />,
    },
    {
      path: "/diet-plans",
      element: <DietPlanWrapper />,
    },
    {
      path: "/membership-plans",
      element: <MembershipPlanWrapper />,
    },
    {
      path: "/membership-plans-user",
      element: <MembershipPlanUser />,
    },
    {
      path: "/workout-plans-user",
      element: <WorkoutPlanUser />,
    },
    // New member routes
    {
      path: "/suppliment-home",
      element: <SupplimentHome />,
    },
    {
      path: "/admin-dashboard",
      element: <AdminDashboard />,
    },
    {
      path: "/add-supplement",
      element: <AddSupplement />,
    },
    {
      path: "/edit-supplement/:id",
      element: <EditSupplement />,
    },
    {
      path: "/user-store",
      element: <UserStoreWrapper />,
    },
    {
      path: "/cart",
      element: <CartWrapper />,
    },
    {
      path: "/product/:id",
      element: <ProductDetailWrapper />,
    },
    {
      path: "/inventory",
      element: <InventoryReport />,
    },
    {
      path: "/inventory-report",
      element: <InventoryReport />,
    },
    {
      path: "/admin/appointments",
      element: <AdminAppointments />,
    },
    {
      path: "/admin/add-session",
      element: <AddSession />,
    },
    {
      path: "/admin/view-sessions",
      element: <ViewSessions />,
    },
    {
      path: "/edit-appointment/:id",
      element: <EditAppointment />,
    },
    {
      path: "/admin/edit-session/:id",
      element: <EditSession />,
    },
    {
      path: "/services/personal-training",
      element: <PersonalTraining />,
    },
    {
      path: "/services/group-class",
      element: <GroupClass />,
    },
    {
      path: "/services/yoga",
      element: <Yoga />,
    },
    {
      path: "/services/crossfit",
      element: <CrossFit />,
    },
    {
      path: "/book-appointment",
      element: <BookAppointment />,
    },
    {
      path: "/my-appointments",
      element: <MyAppointments />,
    },
    {
      path: "/appointment/:id",
      element: <ViewAppointment />,
    },
    {
      path: "/all-sessions",
      element: <AllSessions />,
    },
    {
      path: "/session-home",
      element: <SessionHome />,
    },
    {
      path: "/diet-plan-user",
      element: <DietPlanUser />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/paymentpage",
      element: <PaymentPage />,
    },
    {
      path: "/order-confirmation",
      element: <OrderConfirmation />,
    },
    {
      path: "*",
      element: <div style={{ textAlign: 'center', marginTop: '10vh' }}><h1>404 - Page Not Found</h1><p>The page you are looking for does not exist.</p></div>,
    },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
