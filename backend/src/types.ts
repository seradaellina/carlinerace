export type TrackedApp = {
  id: number;
  name: string;
  packageId: string;
  playStoreUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Screenshot = {
  id: number;
  appId: number;
  imagePath: string;
  capturedAt: string;
  createdAt: string;
};
