export interface Pin {
    id: string;
    latitude: number;
    longitude: number;
    title?: string;
    category?: string;
    image?: string;
    user?: {
      name: string;
      avatar: string;
    };
  }
  
  export interface ClusterPoint {
    id: string;
    latitude: number;
    longitude: number;
    pointCount: number;
    clusteredPins?: Pin[];
    pin?: Pin;
  }
  