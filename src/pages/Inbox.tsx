import { useState } from 'react';
import { mockMessages } from '../lib/mockAI';

export default function Inbox() {
    const [activeTab, setActiveTab] = useState<'manual' | 'auto'>('manual');

    const filteredMessages = mockMessages.filter(msg => {
        return activeTab === 'manual'
            ? msg.status === 'Manual_Required'
            : msg.status === 'Auto_Replied';
    });

    return (
        <div className="space-y-4 pb-20">
            {/* Header / Tabs */}
            <div className="bg-white p-1 rounded-xl border border-sand-200 flex mb-4">
                <button
                    onClick={() => setActiveTab('manual')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'manual'
                            ? 'bg-sage-100 text-sage-800 shadow-sm'
                            : 'text-sage-400 hover:text-sage-600'
                        }`}
                >
                    수동 답변 필요
                    {mockMessages.filter(m => m.status === 'Manual_Required').length > 0 && (
                        <span className="ml-2 bg-red-400 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            {mockMessages.filter(m => m.status === 'Manual_Required').length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('auto')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'auto'
                            ? 'bg-sage-100 text-sage-800 shadow-sm'
                            : 'text-sage-400 hover:text-sage-600'
                        }`}
                >
                    자동 응답 완료
                </button>
            </div>

            {/* AI Status Indicator */}
            <div className="flex items-center justify-between px-2 mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs text-sage-500 font-medium">AI 자동 응대 실행 중</span>
                </div>
                <span className="text-[10px] text-sage-400">Instagram 연동됨</span>
            </div>

            {/* Message List */}
            <div className="space-y-3">
                {filteredMessages.map((msg) => (
                    <div key={msg.id} className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-sm font-bold text-sage-900">{msg.username}</h3>
                                <span className="text-[10px] text-sage-400">{msg.timestamp}</span>
                            </div>
                            {msg.isComplaint && (
                                <span className="bg-red-50 text-red-500 text-[10px] px-2 py-1 rounded-full font-medium border border-red-100">
                                    🚨 컴플레인 감지
                                </span>
                            )}
                        </div>

                        <p className="text-sm text-gray-700 mb-3 bg-sand-50 p-3 rounded-xl rounded-tl-none">
                            {msg.content}
                        </p>

                        <div className="border-t border-sand-100 pt-3">
                            <div className="flex gap-2 items-start">
                                <span className="text-xl">🤖</span>
                                <div className="flex-1">
                                    <p className="text-xs text-sage-500 mb-2 italic">
                                        {msg.aiAnalysis}
                                    </p>

                                    {activeTab === 'auto' ? (
                                        <div className="bg-sage-50 p-3 rounded-xl rounded-tl-none text-sm text-sage-800 border border-sage-100">
                                            {msg.suggestedReply}
                                        </div>
                                    ) : (
                                        <button className="w-full py-2 bg-sage-500 text-white text-sm font-medium rounded-xl hover:bg-sage-600 shadow-sm hover:shadow-md transition-all">
                                            직접 답변 작성하기
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredMessages.length === 0 && (
                    <div className="text-center py-10 text-sage-400 text-sm">
                        메시지가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
