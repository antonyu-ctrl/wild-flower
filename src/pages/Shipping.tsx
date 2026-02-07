import { mockOrders } from '../lib/mockData';

export default function Shipping() {
    return (
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-sand-200">
                <h2 className="text-lg font-medium text-sage-800 mb-4">배송 관리</h2>

                <div className="space-y-3">
                    {mockOrders.map((order) => (
                        <div key={order.id} className="p-4 bg-white rounded-xl border border-sand-200 shadow-sm relative overflow-hidden">
                            <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-bold ${order.status === 'Shipped' ? 'bg-sage-100 text-sage-700' : 'bg-orange-100 text-orange-700'
                                }`}>
                                {order.status === 'Shipped' ? '배송완료' : '배송준비'}
                            </div>

                            <div className="mb-2">
                                <span className="text-xs text-sage-500 block mb-1">주문자: {order.customerName}</span>
                                <h3 className="text-sm font-medium text-sage-900">{order.productName}</h3>
                            </div>

                            {order.trackingNumber ? (
                                <div className="mt-3 pt-3 border-t border-sand-100 flex justify-between items-center">
                                    <span className="text-xs text-sage-400">운송장 번호</span>
                                    <span className="text-xs font-mono text-sage-600 bg-sand-50 px-2 py-1 rounded">
                                        {order.trackingNumber}
                                    </span>
                                </div>
                            ) : (
                                <button className="mt-3 w-full py-2 text-xs font-medium text-white bg-sage-500 rounded-lg hover:bg-sage-600 transition-colors">
                                    운송장 입력하기
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
