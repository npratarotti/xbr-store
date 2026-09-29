export type Review = {
    id: string;
    productId: number;
    userEmail: string;
    userName: string;
    rating: number;
    comment: string;
    photo?: string;
    createdAt: string;
    updatedAt?: string;
  };