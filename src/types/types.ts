export interface RouteData {
    id: number;
    product: string;
    customerName: string;
    mobile: string;
    address: string;
    lat: number;
    lng: number;
    // Optional: Add metadata for the YouTube theme
    estimatedTime?: string; 
    isPriority?: boolean;
}