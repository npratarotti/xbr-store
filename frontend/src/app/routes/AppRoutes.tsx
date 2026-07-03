import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home } from "../../pages/Home/Home";
import { Products } from "../../pages/Products/Products";
import { Product } from "../../pages/Product/Product";
import { Cart } from "../../pages/Cart/Cart";
import { Login } from "../../pages/Login/Login";
import { Register } from "../../pages/Register/Register";
import { NotFound } from "../../pages/NotFound/NotFound";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />

        <Route path="/product/:id" element={<Product />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}