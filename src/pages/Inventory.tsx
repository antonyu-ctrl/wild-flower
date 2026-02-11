import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function Inventory() {
    const { inventory, products, updateInventory } = useData();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<number>(0);

    const getProductPrice = (productId: string) => {
        const master = products.find(m => m.id === productId);
        return master ? master.basePrice : 0;
    };

    const startEditing = (id: string, currentStock: number) => {
        setEditingId(id);
        setEditValue(currentStock);
    };

    const handleSave = (id: string) => {
        updateInventory(id, editValue);
        setEditingId(null);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-sand-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-sage-800">재고 현황</h2>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/products"
                            className="text-xs text-sage-600 underline hover:text-sage-800"
                        >
                            + 신규 상품 등록하러 가기
                        </Link>
                    </div>
                </div>

                <div className="space-y-3">
                    {inventory.map((product) => (
                        <div key={product.id} className="flex items-center p-3 bg-sand-50 rounded-xl border border-sand-100">
                            <div className="w-10 h-10 mr-3 rounded-lg bg-white flex items-center justify-center text-xl shadow-sm border border-sand-100 overflow-hidden">
                                {product.image?.startsWith('data:image') ? (
                                    <img src={product.image} alt={product.productName} className="w-full h-full object-cover" />
                                ) : (
                                    product.image || '📦'
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-sage-900">
                                    {products.find(p => p.id === product.productId)?.name || product.productName}
                                </h3>
                                <p className="text-xs text-sage-500">₩{getProductPrice(product.productId).toLocaleString()}</p>
                            </div>
                            <div className="text-right min-w-[100px]">
                                {editingId === product.id ? (
                                    <div className="flex items-center justify-end gap-2">
                                        <input
                                            type="number"
                                            value={editValue}
                                            onChange={(e) => setEditValue(Number(e.target.value))}
                                            className="w-16 p-1 text-sm border border-sage-300 rounded text-right"
                                            autoFocus
                                        />
                                        <button onClick={() => handleSave(product.id)} className="text-green-600 hover:text-green-800">✅</button>
                                        <button onClick={() => setEditingId(null)} className="text-red-400 hover:text-red-600">❌</button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-end gap-2 group">
                                        {product.stock > 0 ? (
                                            <span className="text-sm font-bold text-sage-600">{product.stock}개</span>
                                        ) : (
                                            <span className="text-xs font-bold text-red-400">품절</span>
                                        )}
                                        <button
                                            onClick={() => startEditing(product.id, product.stock)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-sage-400 hover:text-sage-600 text-xs"
                                        >
                                            ✏️
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
