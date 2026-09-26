import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home } from "../../pages/Home/Home";
import { Products } from "../../pages/Products/Products";
import { Product } from "../../pages/Product/Product";
import { Cart } from "../../pages/Cart/Cart";
import { Login } from "../../pages/Login/Login";
import { Register } from "../../pages/Register/Register";
import { NotFound } from "../../pages/NotFound/NotFound";
import { Checkout } from "../../pages/Checkout/Checkout";
import { OrderSuccess } from "../../pages/OrderSuccess/OrderSuccess";
import { Profile } from "../../pages/Profile/Profile";

import { CartProvider } from "../providers/CartProvider";
import { AuthProvider } from "../providers/AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import { Admin } from "../../pages/Admin/Admin";
import { AdminRoute } from "./AdminRoute";
import { DemoBanner } from "../../shared/components/layout/DemoBanner";



export function AppRoutes() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/products" element={<Products />} />

            <Route path="/product/:id" element={<Product />} />

            <Route path="/cart" element={<Cart />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/order-success" element={<OrderSuccess />} />

            <Route element={<ProtectedRoute />}>

              <Route path="/checkout" element={<Checkout />} />

              <Route path="/profile" element={<Profile />} />

              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<Admin />} />
              </Route>

            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <DemoBanner />
      </CartProvider>
    </AuthProvider>
  );
}