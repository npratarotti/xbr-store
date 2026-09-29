import { useEffect, useState } from "react";
import type { Review } from "../types/review";
import type { Order } from "./useOrders";

const STORAGE_KEY = "xbr-reviews";
const EVT = "xbr-reviews-updated";

function readAll(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(reviews: Review[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  window.dispatchEvent(new Event(EVT));
}

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>(readAll);

  useEffect(() => {
    const sync = () => setReviews(readAll());

    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return reviews;
}

export function getProductReviews(productId: number): Review[] {
  return readAll()
    .filter((r) => r.productId === productId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
}

export function getAverageRating(productId: number): {
  average: number;
  count: number;
} {
  const list = getProductReviews(productId);
  if (list.length === 0) return { average: 0, count: 0 };

  const sum = list.reduce((acc, r) => acc + r.rating, 0);
  return { average: sum / list.length, count: list.length };
}

export function hasUserBoughtProduct(
  userEmail: string,
  productId: number
): boolean {
  try {
    const raw = localStorage.getItem("xbr-orders");
    if (!raw) return false;

    const orders: Order[] = JSON.parse(raw);
    const email = userEmail.toLowerCase().trim();

    return orders.some(
      (order) =>
        order.customer?.email?.toLowerCase().trim() === email &&
        order.status !== "Cancelado" &&
        order.items.some((item) => item.id === productId)
    );
  } catch {
    return false;
  }
}

export function getUserReview(
  userEmail: string,
  productId: number
): Review | null {
  const email = userEmail.toLowerCase().trim();
  return (
    readAll().find(
      (r) =>
        r.productId === productId &&
        r.userEmail.toLowerCase().trim() === email
    ) || null
  );
}

export function upsertReview(
  review: Omit<Review, "id" | "createdAt" | "updatedAt">
): Review {
  const all = readAll();
  const email = review.userEmail.toLowerCase().trim();

  const existingIndex = all.findIndex(
    (r) =>
      r.productId === review.productId &&
      r.userEmail.toLowerCase().trim() === email
  );

  if (existingIndex >= 0) {
    const updated: Review = {
      ...all[existingIndex],
      rating: review.rating,
      comment: review.comment,
      photo: review.photo,
      updatedAt: new Date().toISOString(),
    };

    all[existingIndex] = updated;
    writeAll(all);
    return updated;
  }

  const created: Review = {
    id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    productId: review.productId,
    userEmail: email,
    userName: review.userName,
    rating: review.rating,
    comment: review.comment,
    photo: review.photo,
    createdAt: new Date().toISOString(),
  };

  all.push(created);
  writeAll(all);
  return created;
}

export function deleteReview(reviewId: string) {
  const all = readAll().filter((r) => r.id !== reviewId);
  writeAll(all);
}