import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
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
    updateProduct: (id: string, details: Partial<ProductMaster>) => void;
    deleteProduct: (id: string) => void;
    updateInventory: (id: string, quantity: number) => void;
    updateAdminPassword: (newPassword: string) => void;
    addCategory: (name: string, prefix: string) => void;
    deleteCategory: (id: string) => void;
    connectInstagram: (handle: string) => void;
    disconnectInstagram: () => void;
    simulateWebOrder: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    // Initialize with LocalStorage or Mock Data
    const [inventory, setInventory] = useState<InventoryItem[]>(() => {
        const saved = localStorage.getItem('wf_inventory');
        return saved ? JSON.parse(saved) : initialInventory;
    });
    const [orders, setOrders] = useState<Order[]>(() => {
        const saved = localStorage.getItem('wf_orders');
        return saved ? JSON.parse(saved) : initialOrders;
    });
    const [products, setProducts] = useState<ProductMaster[]>(() => {
        const saved = localStorage.getItem('wf_products');
        return saved ? JSON.parse(saved) : initialProducts;
    });

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem('wf_inventory', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('wf_orders', JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        localStorage.setItem('wf_products', JSON.stringify(products));
    }, [products]);

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
            status: 'Pending',
            source: orderData.source || 'manual'
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
            image: product.image || '✨'
        };
        setInventory(prev => [...prev, newInvItem]);
    };

    const updateProduct = (id: string, details: Partial<ProductMaster>) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...details } : p));
        // If image is updated, also update inventory image for consistency (optional but good for UI)
        // If image or name is updated, also update inventory for consistency
        if (details.image || details.name) {
            setInventory(prev => prev.map(i => i.productId === id ? {
                ...i,
                image: details.image || i.image,
                productName: details.name || i.productName
            } : i));
        }
    };

    const deleteProduct = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
        // Also remove from inventory
        setInventory(prev => prev.filter(i => i.productId !== id));
    };

    const updateInventory = (id: string, quantity: number) => {
        setInventory(prev => prev.map(item =>
            item.id === id ? { ...item, stock: quantity } : item
        ));
    };

    const simulateWebOrder = () => {
        // Randomly pick a product
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const names = ['Park', 'Lee', 'Kim', 'Choi', 'Jung'];
        const randomName = names[Math.floor(Math.random() * names.length)] + ' ' + Math.floor(Math.random() * 100);

        addOrder({
            customerName: randomName,
            contactInfo: `${randomName.toLowerCase().replace(' ', '')}@email.com`,
            source: 'web',
            productName: randomProduct.name,
            quantity: 1,
            trackingNumber: '',
            shippingDate: ''
        }, 1);
    };

    return (
        <DataContext.Provider value={{
            inventory, orders, products,
            adminPassword, categories, instagramConfig, isPasswordSet,
            addOrder, updateOrderStatus, deleteOrder, addProduct, updateProduct, deleteProduct, updateInventory,
            updateAdminPassword, addCategory, deleteCategory,
            connectInstagram, disconnectInstagram, simulateWebOrder
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
