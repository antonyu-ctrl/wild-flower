import { createContext, useContext, useState, type ReactNode } from 'react';
import {
    mockInventory as initialInventory,
    mockOrders as initialOrders,
    mockProductMaster as initialProducts,
} from '../lib/mockData';
import type { InventoryItem, Order, ProductMaster } from '../lib/mockData';

export interface InstagramConfig {
    connected: boolean;
    handle: string | null;
    connectedAt: number | null;
}

interface DataContextType {
    inventory: InventoryItem[];
    orders: Order[];
    products: ProductMaster[];
    adminPassword: string;
    categories: { id: string; name: string; prefix: string; }[];
    instagramConfig: InstagramConfig;
    isPasswordSet: boolean;
    addOrder: (order: Omit<Order, 'id' | 'status'>, quantity: number) => void;
    updateOrderStatus: (orderId: string, status: Order['status'], details?: Partial<Order>) => void;
    deleteOrder: (orderId: string) => void;
    addProduct: (product: ProductMaster) => void;
    updateAdminPassword: (newPassword: string) => void;
    addCategory: (name: string, prefix: string) => void;
    deleteCategory: (id: string) => void;
    connectInstagram: (handle: string) => void;
    disconnectInstagram: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [products, setProducts] = useState<ProductMaster[]>(initialProducts);

    const [adminPassword, setAdminPassword] = useState<string>(() => localStorage.getItem('adminPassword') || '1234');

    // Check if password involves a change from default '1234'
    const isPasswordSet = adminPassword !== '1234';

    const [categories, setCategories] = useState<{ id: string; name: string; prefix: string; }[]>(() => {
        const saved = localStorage.getItem('productCategories');
        return saved ? JSON.parse(saved) : [
            { id: 'cat1', name: 'Dress', prefix: 'DR' },
            { id: 'cat2', name: 'Bag', prefix: 'BG' },
            { id: 'cat3', name: 'Top', prefix: 'TOP' },
            { id: 'cat4', name: 'Skirt', prefix: 'SK' },
            { id: 'cat5', name: 'Accessory', prefix: 'ACC' },
            { id: 'cat6', name: 'Outer', prefix: 'OT' },
            { id: 'cat7', name: 'Pants', prefix: 'PT' }
        ];
    });

    const [instagramConfig, setInstagramConfig] = useState<InstagramConfig>(() => {
        const saved = localStorage.getItem('instagramConfig');
        return saved ? JSON.parse(saved) : { connected: false, handle: null, connectedAt: null };
    });

    const updateAdminPassword = (newPassword: string) => {
        setAdminPassword(newPassword);
        localStorage.setItem('adminPassword', newPassword);
    };

    const addCategory = (name: string, prefix: string) => {
        const newCategory = { id: `cat-${Date.now()}`, name, prefix };
        const updated = [...categories, newCategory];
        setCategories(updated);
        localStorage.setItem('productCategories', JSON.stringify(updated));
    };

    const deleteCategory = (id: string) => {
        const updated = categories.filter(c => c.id !== id);
        setCategories(updated);
        localStorage.setItem('productCategories', JSON.stringify(updated));
    };

    const connectInstagram = (handle: string) => {
        const config = {
            connected: true,
            handle,
            connectedAt: Date.now()
        };
        setInstagramConfig(config);
        localStorage.setItem('instagramConfig', JSON.stringify(config));
    };

    const disconnectInstagram = () => {
        const config = {
            connected: false,
            handle: null,
            connectedAt: null
        };
        setInstagramConfig(config);
        localStorage.setItem('instagramConfig', JSON.stringify(config));
    };

    const addOrder = (orderData: Omit<Order, 'id' | 'status'>, quantity: number) => {
        // 1. Create Order
        const newOrder: Order = {
            ...orderData,
            id: `ord-${Date.now()}`,
            status: 'Pending'
        };
        setOrders(prev => [newOrder, ...prev]);

        // 2. Deduct Stock
        setInventory(prev => prev.map(item => {
            if (item.productName === orderData.productName) { // Linking by name for now as per mock setup
                return { ...item, stock: Math.max(0, item.stock - quantity) };
            }
            return item;
        }));
    };

    const updateOrderStatus = (orderId: string, status: Order['status'], details?: Partial<Order>) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, status, ...details } : order
        ));
    };

    const deleteOrder = (orderId: string) => {
        setOrders(prev => prev.filter(o => o.id !== orderId));
    };

    const addProduct = (product: ProductMaster) => {
        setProducts(prev => [...prev, product]);
        // Also initialize inventory for it
        const newInvItem: InventoryItem = {
            id: `inv-${Date.now()}`,
            productId: product.id,
            productName: product.name,
            stock: 0,
            image: '✨'
        };
        setInventory(prev => [...prev, newInvItem]);
    };

    return (
        <DataContext.Provider value={{
            inventory, orders, products,
            adminPassword, categories, instagramConfig, isPasswordSet,
            addOrder, updateOrderStatus, deleteOrder, addProduct,
            updateAdminPassword, addCategory, deleteCategory,
            connectInstagram, disconnectInstagram
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
