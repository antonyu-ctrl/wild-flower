// Product Definition (Standardized Names)
export interface ProductMaster {
    id: string;
    code: string;
    name: string;
    category: string;
    basePrice: number;
}

// Inventory Item (Linked to ProductMaster)
export interface InventoryItem {
    id: string;
    productId: string; // Links to ProductMaster
    productName: string; // Denormalized for convenience
    stock: number;
    restockDate?: string;
    image: string; // For mock display
}

export interface Order {
    id: string;
    customerName: string;
    productName: string;
    quantity: number;
    instagramId?: string; // New field for DM matching
    status: 'Pending' | 'Shipped' | 'Delivered';
    trackingNumber?: string;
    shippingDate?: string;
    estimatedArrival?: string;
}

export const mockProductMaster: ProductMaster[] = [
    { id: 'p1', code: 'DR-001', name: '린넨 원피스 (Beige)', category: 'Dress', basePrice: 89000 },
    { id: 'p2', code: 'BG-002', name: '자수 에코백', category: 'Bag', basePrice: 35000 },
    { id: 'p3', code: 'BL-003', name: '와일드플라워 블라우스', category: 'Top', basePrice: 62000 },
    { id: 'p4', code: 'SK-004', name: '코튼 롱 스커트', category: 'Skirt', basePrice: 45000 },
    { id: 'p5', code: 'ACC-005', name: '실크 스카프', category: 'Accessory', basePrice: 28000 },
];

export const mockInventory: InventoryItem[] = [
    { id: '1', productId: 'p1', productName: '린넨 원피스 (Beige)', stock: 5, image: '👗' },
    { id: '2', productId: 'p2', productName: '자수 에코백', stock: 0, restockDate: '2025-02-15', image: '👜' },
    { id: '3', productId: 'p3', productName: '와일드플라워 블라우스', stock: 12, image: '👚' },
];

export const mockOrders: Order[] = [
    { id: '101', customerName: '김민지', instagramId: '@minji_daily', productName: '린넨 원피스 (Beige)', quantity: 1, status: 'Shipped', trackingNumber: 'CJ-1234-5678', shippingDate: '2025-02-06' },
    { id: '102', customerName: '이서준', instagramId: '@seojun_lee', productName: '자수 에코백', quantity: 1, status: 'Pending' },
];
