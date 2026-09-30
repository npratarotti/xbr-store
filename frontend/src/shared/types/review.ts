export type Review = {
    id: number;
    productId: number;
    userId: string;
    userName: string;
    userEmail: string;
    rating: number;
    comment: string;
    photo?: string;
    createdAt: string;
    updatedAt?: string;
  };