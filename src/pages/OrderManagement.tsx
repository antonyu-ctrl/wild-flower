import { useState } from 'react';
import { useData } from '../context/DataContext';

export default function OrderManagement() {
    const { orders, addOrder, updateOrderStatus, deleteOrder, adminPassword, products } = useData();
    const [activeTab, setActiveTab] = useState<'register' | 'list'>('register');

    // Registration Form State
    const [selectedProductId, setSelectedProductId] = useState('');
    const [customerName, setCustomerName] = useState('');

    const [quantity, setQuantity] = useState(1);

    // List Management State
    const [searchTerm, setSearchTerm] = useState('');

    // Shipping Update State
    const [shippingUpdateId, setShippingUpdateId] = useState<string | null>(null);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [shippingDate, setShippingDate] = useState('');

    // Password Modal State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    // Derived State
    const filteredOrders = orders.filter(order =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.contactInfo && order.contactInfo.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleRegister = () => {
        if (!selectedProductId || !customerName) {
            alert('상품과 고객명을 입력해주세요.');
            return;
        }

        const product = products.find(p => p.id === selectedProductId);
        if (!product) return;

        addOrder({
            customerName,
            contactInfo: '', // No manual entry for now
            source: 'manual',
            productName: product.name,
            quantity,
            trackingNumber: '',
            shippingDate: ''
        }, quantity);

        // Reset form
        setCustomerName('');
        setQuantity(1);
        alert('주문이 등록되었습니다. (재고 자동 차감 완료)');
        setActiveTab('list');
    };

    const handleShip = (orderId: string) => {
        if (!trackingNumber || !shippingDate) return;
        updateOrderStatus(orderId, 'Shipped', { trackingNumber, shippingDate });
        setShippingUpdateId(null);
        setTrackingNumber('');
        setShippingDate('');
    };

    const handleDeleteClick = (orderId: string, status: string) => {
        // Safety 1: Status Check
        if (status === 'Shipped' || status === 'Delivered') {
            if (!confirm('경고: 이미 발송된 주문입니다! 정말 삭제하시겠습니까? (재고는 복구되지 않습니다)')) return;
        }
        setPendingDeleteId(orderId);
        setShowPasswordModal(true);
        setPasswordInput('');
    };

    const confirmDelete = () => {
        if (passwordInput === adminPassword) {
            if (pendingDeleteId) {
                deleteOrder(pendingDeleteId);
                alert('주문이 삭제되었습니다.');
            }
            setShowPasswordModal(false);
            setPendingDeleteId(null);
            setPasswordInput('');
        } else {
            alert('비밀번호가 일치하지 않습니다.');
        }
    };

    return (
        <div className="space-y-4 pb-20 relative">
            {/* Header / Tabs */}
            <div className="bg-white p-1 rounded-xl border border-sand-200 flex mb-4">
                <button
                    onClick={() => setActiveTab('register')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'register'
                        ? 'bg-sage-100 text-sage-800 shadow-sm'
                        : 'text-sage-400 hover:text-sage-600'
                        }`}
                >
                    주문 등록
                </button>
                <button
                    onClick={() => setActiveTab('list')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'list'
                        ? 'bg-sage-100 text-sage-800 shadow-sm'
                        : 'text-sage-400 hover:text-sage-600'
                        }`}
                >
                    배송 관리
                </button>
            </div>

            {activeTab === 'register' ? (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-sand-200 space-y-4">
                    <h2 className="text-lg font-medium text-sage-800 mb-2">새 주문 입력</h2>

                    <div>
                        <label className="block text-xs font-medium text-sage-700 mb-1">상품 선택</label>
                        <select
                            className="w-full p-3 border border-sand-200 rounded-xl bg-white text-sm"
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                        >
                            <option value="">상품을 선택하세요</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-sage-700 mb-1">고객명</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-sand-200 rounded-xl text-sm"
                            placeholder="주문자 성함"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                    </div>



                    <div>
                        <label className="block text-xs font-medium text-sage-700 mb-1">수량</label>
                        <input
                            type="number"
                            min="1"
                            className="w-full p-3 border border-sand-200 rounded-xl text-sm"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                    </div>

                    <button
                        onClick={handleRegister}
                        className="w-full py-3 bg-sage-600 text-white rounded-xl font-medium shadow-md hover:bg-sage-700 transition-all mt-4"
                    >
                        주문 등록하기
                    </button>
                    <p className="text-center text-xs text-sage-400 mt-2">* 주문 등록 시 재고가 자동으로 차감됩니다.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="고객명 또는 Instagram ID 검색..."
                            className="w-full p-3 pl-10 border border-sand-200 rounded-xl text-sm bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute left-3 top-3.5 text-sage-400">
                            🔍
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="p-4 bg-white rounded-xl border border-sand-200 shadow-sm relative overflow-hidden">
                                <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-bold ${order.status === 'Shipped' ? 'bg-sage-100 text-sage-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                    {order.status === 'Shipped' ? '배송완료' : '배송준비'}
                                </div>

                                <div className="mb-2 pr-16"> {/* Padding right to avoid overlap with delete button */}
                                    <h3 className="text-sm font-bold text-sage-900 flex items-center gap-2">
                                        {order.customerName}
                                        {order.contactInfo && (
                                            <span className="text-[10px] font-normal font-mono text-sage-500 bg-sand-100 px-1.5 py-0.5 rounded">
                                                {order.contactInfo}
                                            </span>
                                        )}
                                        {/* Source Badge */}
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded border ${order.source === 'web' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                            order.source === 'instagram' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                'bg-gray-50 text-gray-500 border-gray-200'
                                            }`}>
                                            {order.source === 'web' ? 'WEB' : order.source === 'instagram' ? 'IG' : 'MANUAL'}
                                        </span>
                                    </h3>
                                    <p className="text-xs text-sage-600">{order.productName} (Qty: {order.quantity})</p>
                                </div>

                                {shippingUpdateId === order.id ? (
                                    <div className="mt-3 pt-3 border-t border-sand-100 bg-sand-50 -mx-4 -mb-4 p-4 space-y-2">
                                        <input
                                            type="text"
                                            placeholder="운송장 번호"
                                            className="w-full p-2 border border-sand-200 rounded-lg text-xs"
                                            value={trackingNumber}
                                            onChange={(e) => setTrackingNumber(e.target.value)}
                                        />
                                        <input
                                            type="date"
                                            className="w-full p-2 border border-sand-200 rounded-lg text-xs"
                                            value={shippingDate}
                                            onChange={(e) => setShippingDate(e.target.value)}
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setShippingUpdateId(null)}
                                                className="flex-1 py-2 bg-white border border-sand-200 text-sage-600 text-xs rounded-lg"
                                            >
                                                취소
                                            </button>
                                            <button
                                                onClick={() => handleShip(order.id)}
                                                className="flex-1 py-2 bg-sage-600 text-white text-xs rounded-lg font-medium"
                                            >
                                                발송 처리
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-2 pt-2 border-t border-sand-100 flex flex-col gap-2">
                                        {order.status === 'Pending' ? (
                                            <button
                                                onClick={() => setShippingUpdateId(order.id)}
                                                className="w-full py-2 text-xs font-medium text-white bg-orange-400 rounded-lg hover:bg-orange-500 transition-colors"
                                            >
                                                운송장 입력하기
                                            </button>
                                        ) : (
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-sage-400">발송일: {order.shippingDate}</span>
                                                <span className="text-[10px] font-mono text-sage-600">{order.trackingNumber}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-end gap-2 mt-1">
                                            {/* DM Link Button (If Instagram ID exists) */}
                                            {order.contactInfo && order.contactInfo.startsWith('@') && (
                                                <a
                                                    href={`https://ig.me/m/${order.contactInfo.replace('@', '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center"
                                                >
                                                    DM 보내기
                                                </a >
                                            )}

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDeleteClick(order.id, order.status)}
                                                className="px-3 py-1 border border-red-200 text-red-400 text-[10px] rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                삭제
                                            </button>
                                        </div >
                                    </div >
                                )}
                            </div >
                        ))}
                        {
                            filteredOrders.length === 0 && (
                                <div className="text-center py-10 text-sage-400 text-sm">
                                    {searchTerm ? '검색 결과가 없습니다.' : '주문 내역이 없습니다.'}
                                </div>
                            )
                        }
                    </div >
                </div >
            )}

            {/* Custom Password Modal */}
            {showPasswordModal && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-2xl">
                    <div className="bg-white p-6 rounded-xl w-5/6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-sage-900 mb-2">관리자 확인</h3>
                        <p className="text-xs text-sage-600 mb-4">주문 삭제를 위해 비밀번호를 입력해주세요.</p>
                        <input
                            type="password"
                            autoFocus
                            className="w-full p-3 border border-sand-200 rounded-lg text-sm mb-4"
                            placeholder="비밀번호"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') confirmDelete();
                            }}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="flex-1 py-2 bg-sand-100 text-sage-600 rounded-lg text-sm font-medium"
                            >
                                취소
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium"
                            >
                                삭제하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
