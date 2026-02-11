import { useState, useRef, type ChangeEvent } from 'react';
import { useData } from '../context/DataContext';
import type { ProductMaster } from '../lib/mockData';
import ConfirmationModal from '../components/ConfirmationModal';

export default function ProductMasterPage() {
    const { products, addProduct, updateProduct, deleteProduct, categories } = useData();
    const [isAdding, setIsAdding] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', code: '', category: '', basePrice: 0 });
    const [deleteConfirm, setDeleteConfirm] = useState<ProductMaster | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
    const [tempPrice, setTempPrice] = useState<number>(0);

    const handleDelete = () => {
        if (deleteConfirm) {
            deleteProduct(deleteConfirm.id);
            setDeleteConfirm(null);
        }
    };

    const handleImageClick = (productId: string) => {
        setEditingProductId(productId);
        fileInputRef.current?.click();
    };

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 300;
                    const MAX_HEIGHT = 300;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG with 0.7 quality
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(dataUrl);
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && editingProductId) {
            try {
                const compressedImage = await compressImage(file);
                updateProduct(editingProductId, { image: compressedImage });
                setEditingProductId(null);
                if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
            } catch (error) {
                console.error('Image compression failed:', error);
                alert('이미지 처리 중 오류가 발생했습니다.');
            }
        }
    };

    const getCategoryEmoji = (categoryName: string) => {
        if (categoryName.includes('Dress') || categoryName.includes('원피스')) return '👗';
        if (categoryName.includes('Bag') || categoryName.includes('가방')) return '👜';
        if (categoryName.includes('Top') || categoryName.includes('상의')) return '👚';
        if (categoryName.includes('Skirt') || categoryName.includes('치마')) return '👗';
        if (categoryName.includes('Pants') || categoryName.includes('바지')) return '👖';
        if (categoryName.includes('Accessory') || categoryName.includes('액세서리')) return '🧣';
        if (categoryName.includes('Outer') || categoryName.includes('아우터')) return '🧥';
        return '📦';
    };

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
            basePrice: newProduct.basePrice,
            image: getCategoryEmoji(newProduct.category)
        };
        addProduct(p);
        setIsAdding(false);
        setNewProduct({ name: '', code: '', category: '', basePrice: 0 });
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-sand-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-sage-800">상품 기준 정보</h2>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="text-xs bg-sage-500 text-white px-3 py-1.5 rounded-lg hover:bg-sage-600 transition-colors flex-shrink-0"
                        style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all' }}
                    >
                        {isAdding ? '취소' : '+ 상품등록'}
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
                        <div key={product.id} className="flex justify-between items-center p-3 border-b border-sand-100 last:border-0 hover:bg-sage-50 transition-colors rounded-lg group">
                            <div className="flex items-center gap-3">
                                <div
                                    onClick={() => handleImageClick(product.id)}
                                    className="w-10 h-10 rounded-lg bg-sand-50 flex items-center justify-center text-xl shadow-sm border border-sand-100 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    {product.image?.startsWith('data:image') ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        product.image || '📦'
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-sage-900">{product.name}</h3>
                                    <div className="flex gap-2 mt-1">
                                        <span className="text-[10px] bg-sand-200 text-sage-700 px-1.5 py-0.5 rounded">{product.code}</span>
                                        <span className="text-[10px] text-sage-500">{product.category}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {editingPriceId === product.id ? (
                                    <input
                                        type="number"
                                        value={tempPrice}
                                        onChange={(e) => setTempPrice(Number(e.target.value))}
                                        onBlur={() => {
                                            updateProduct(product.id, { basePrice: tempPrice });
                                            setEditingPriceId(null);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                updateProduct(product.id, { basePrice: tempPrice });
                                                setEditingPriceId(null);
                                            } else if (e.key === 'Escape') {
                                                setEditingPriceId(null);
                                            }
                                        }}
                                        autoFocus
                                        className="w-24 text-sm font-medium text-sage-600 border border-sage-300 rounded px-1 py-0.5 text-right no-spinner"
                                    />
                                ) : (
                                    <span
                                        onClick={() => {
                                            setEditingPriceId(product.id);
                                            setTempPrice(product.basePrice);
                                        }}
                                        className="text-sm font-medium text-sage-600 cursor-pointer hover:bg-sand-100 px-1 py-0.5 rounded transition-colors"
                                        title="클릭하여 가격 수정"
                                    >
                                        ₩{product.basePrice.toLocaleString()}
                                    </span>
                                )}
                                <button
                                    onClick={() => setDeleteConfirm(product)}
                                    className="text-sand-400 hover:text-red-500 transition-colors p-1"
                                    title="삭제"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!deleteConfirm}
                title="상품 삭제"
                message={`'${deleteConfirm?.name}' 상품을 정말 삭제하시겠습니까?\n삭제 시 재고 정보도 함께 사라집니다.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteConfirm(null)}
            />

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
        </div>
    );
}
