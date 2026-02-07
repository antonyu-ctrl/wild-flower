import { useState } from 'react';
import { useData } from '../context/DataContext';
import type { ProductMaster } from '../lib/mockData';

export default function ProductMasterPage() {
    const { products, addProduct, categories } = useData();
    const [isAdding, setIsAdding] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', code: '', category: '', basePrice: 0 });

    const handleAdd = () => {
        if (!newProduct.name || !newProduct.category) {
            alert('상품명과 카테고리를 입력해주세요.');
            return;
        }

        // Auto-generate Code: PREFIX + Sequence
        // 1. Determine Prefix
        const selectedCat = categories.find(c => c.name === newProduct.category);
        const prefix = selectedCat ? selectedCat.prefix : 'PR';

        // 2. Determine Sequence (Global Count + 1)
        const nextSeq = products.length + 1;
        const code = `${prefix}-${String(nextSeq).padStart(3, '0')}`;

        const p: ProductMaster = {
            id: `p${Date.now()}`,
            name: newProduct.name,
            code: code,
            category: newProduct.category,
            basePrice: newProduct.basePrice
        };
        addProduct(p);
        setIsAdding(false);
        setNewProduct({ name: '', code: '', category: '', basePrice: 0 });
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-sand-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-sage-800">상품 기준 정보 (Product Master)</h2>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="text-xs bg-sage-500 text-white px-3 py-1.5 rounded-lg hover:bg-sage-600 transition-colors"
                    >
                        {isAdding ? '취소' : '+ 상품 등록'}
                    </button>
                </div>

                {isAdding && (
                    <div className="mb-4 p-4 bg-sand-50 rounded-xl border border-sand-200 space-y-3">
                        <input
                            type="text"
                            placeholder="상품명 (예: 린넨 원피스)"
                            className="w-full p-2 border border-sand-200 rounded-lg text-sm"
                            value={newProduct.name}
                            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                        <div className="flex gap-2">
                            <select
                                className="flex-1 p-2 border border-sand-200 rounded-lg text-sm bg-white"
                                value={newProduct.category}
                                onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                            >
                                <option value="">카테고리 선택</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name} ({cat.prefix})</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="기본가"
                                className="flex-1 p-2 border border-sand-200 rounded-lg text-sm"
                                value={newProduct.basePrice || ''}
                                onChange={e => setNewProduct({ ...newProduct, basePrice: Number(e.target.value) })}
                            />
                        </div>
                        <p className="text-[10px] text-sage-400">* 상품 코드는 카테고리에 맞춰 자동 생성됩니다. (예: DR-006)</p>
                        <button
                            onClick={handleAdd}
                            className="w-full py-2 bg-sage-600 text-white text-sm rounded-lg font-medium"
                        >
                            등록 완료
                        </button>
                    </div>
                )}

                <div className="space-y-2">
                    {products.map((product) => (
                        <div key={product.id} className="flex justify-between items-center p-3 border-b border-sand-100 last:border-0 hover:bg-sage-50 transition-colors rounded-lg">
                            <div>
                                <h3 className="text-sm font-medium text-sage-900">{product.name}</h3>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-[10px] bg-sand-200 text-sage-700 px-1.5 py-0.5 rounded">{product.code}</span>
                                    <span className="text-[10px] text-sage-500">{product.category}</span>
                                </div>
                            </div>
                            <span className="text-sm font-medium text-sage-600">₩{product.basePrice.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
