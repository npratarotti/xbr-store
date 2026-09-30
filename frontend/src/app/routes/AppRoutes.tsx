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
import { About } from "../../pages/About/About";
import { Wishlist } from "../../pages/Wishlist/Wishlist";
import { PaymentSuccess } from "../../pages/PaymentSuccess/PaymentSuccess";
import { PaymentFailure } from "../../pages/PaymentFailure/PaymentFailure";
import { PaymentPending } from "../../pages/PaymentPending/PaymentPending";

import { CartProvider } from "../providers/CartProvider";
import { AuthProvider } from "../providers/AuthProvider";
import { WishlistProvider } from "../providers/WishlistProvider";
import { ThemeProvider } from "../providers/ThemeProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import { Admin } from "../../pages/Admin/Admin";
import { AdminRoute } from "./AdminRoute";
import { DemoBanner } from "../../shared/components/layout/DemoBanner";

export function AppRoutes() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/order-success" element={<OrderSuccess />} />

                {/* Pagamento Mercado Pago */}
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/failure" element={<PaymentFailure />} />
                <Route path="/payment/pending" element={<PaymentPending />} />

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
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}