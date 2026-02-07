import { useData } from '../context/DataContext';

export default function Inventory() {
    const { inventory, products } = useData();

    const getProductPrice = (productId: string) => {
        const master = products.find(m => m.id === productId);
        return master ? master.basePrice : 0;
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-sand-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-sage-800">재고 현황</h2>
                    <span className="text-xs font-medium bg-sage-100 text-sage-600 px-2 py-1 rounded-full">
                        총 {inventory.length}개
                    </span>
                </div>

                <div className="space-y-3">
                    {inventory.map((product) => (
                        <div key={product.id} className="flex items-center p-3 bg-sand-50 rounded-xl border border-sand-100">
                            <div className="text-3xl mr-3">{product.image}</div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-sage-900">{product.productName}</h3>
                                <p className="text-xs text-sage-500">₩{getProductPrice(product.productId).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                {product.stock > 0 ? (
                                    <span className="text-sm font-bold text-sage-600">{product.stock}개</span>
                                ) : (
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs font-bold text-red-400">품절</span>
                                        {product.restockDate && (
                                            <span className="text-xs text-sage-400">{product.restockDate} 입고</span>
                                        )}
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
