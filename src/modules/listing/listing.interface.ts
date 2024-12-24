export interface IListing {
  title: string;
  description: string;
  sport: string;
  weightClass?: string;
  trainingType?: string;
  location: {
    city: string;
    radius: number;
  };
  userId: string;
  isProUser: boolean;
  // createdAt: Date;
}
