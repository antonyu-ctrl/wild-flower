export interface InventoryItem {
    id: string;
    productId: string;
    productName: string;
    stock: number;
    image: string;
}

export interface Order {
    id: string;
    customerName: string;
    contactInfo?: string; // Generic contact info (e.g. Email, Instagram ID, Phone)
    productName: string;
    quantity: number;
    status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
    trackingNumber?: string;
    shippingDate?: string;
    source: 'manual' | 'instagram' | 'web'; // Added source field
}

export interface ProductMaster {
    id: string;
    name: string;
    code: string; // Auto-generated: PREFIX-0001
    category: string; // Linked to Category List
    basePrice: number;
    image?: string; // Added image field for emojis
}

export const mockCategories = [
    { id: 'cat1', name: 'Dress', prefix: 'DR' },
    { id: 'cat2', name: 'Bag', prefix: 'BG' },
    { id: 'cat3', name: 'Top', prefix: 'TOP' },
    { id: 'cat4', name: 'Skirt', prefix: 'SK' },
    { id: 'cat5', name: 'Accessory', prefix: 'ACC' },
    { id: 'cat6', name: 'Outer', prefix: 'OT' },
    { id: 'cat7', name: 'Pants', prefix: 'PT' }
];

export const mockProductMaster: ProductMaster[] = [
    { id: 'p1', name: 'Linen Dress', code: 'DR-001', category: 'Dress', basePrice: 89000, image: '👗' },
    { id: 'p2', name: 'Silk Blouse', code: 'TOP-001', category: 'Top', basePrice: 65000, image: '👚' },
    { id: 'p3', name: 'Wide Pants', code: 'PT-001', category: 'Pants', basePrice: 72000, image: '👖' },
    { id: 'p4', name: 'Canvas Bag', code: 'BG-001', category: 'Bag', basePrice: 45000, image: '👜' },
];

export const mockInventory: InventoryItem[] = [
    { id: 'inv1', productId: 'p1', productName: 'Linen Dress', stock: 15, image: '👗' },
    { id: 'inv2', productId: 'p2', productName: 'Silk Blouse', stock: 8, image: '👚' },
    { id: 'inv3', productId: 'p3', productName: 'Wide Pants', stock: 20, image: '👖' },
    { id: 'inv4', productId: 'p4', productName: 'Canvas Bag', stock: 5, image: '👜' },
];

export const mockOrders: Order[] = [
    { id: 'ord1', customerName: 'Jisu Kim', contactInfo: '@jisu_daily', source: 'instagram', productName: 'Linen Dress', quantity: 1, status: 'Pending' },
    { id: 'ord2', customerName: 'Minho Lee', contactInfo: 'minho@email.com', source: 'web', productName: 'Wide Pants', quantity: 2, status: 'Shipped', trackingNumber: 'KR123456789', shippingDate: '2023-10-25' },
    { id: 'ord3', customerName: 'Seoyeon Park', contactInfo: '', source: 'manual', productName: 'Canvas Bag', quantity: 1, status: 'Delivered', trackingNumber: 'KR987654321', shippingDate: '2023-10-20' },
];
