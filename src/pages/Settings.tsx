import { useState } from 'react';
import { useData } from '../context/DataContext';
import ConfirmationModal from '../components/ConfirmationModal';

export default function Settings() {
    const {
        adminPassword, updateAdminPassword,
        categories, addCategory, deleteCategory,
        instagramConfig, connectInstagram, disconnectInstagram,
        simulateWebOrder
    } = useData();

    // Password State
    const [newPassword, setNewPassword] = useState('');
    const [currentPasswordInput, setCurrentPasswordInput] = useState('');

    // Category State
    const [newCatName, setNewCatName] = useState('');
    const [newCatPrefix, setNewCatPrefix] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState<{
        type: 'ADD' | 'DELETE';
        title: string;
        message: string;
        data: any;
    } | null>(null);

    // Instagram State
    const [handleInput, setHandleInput] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const handlePasswordUpdate = () => {
        if (currentPasswordInput !== adminPassword) {
            alert('현재 비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!newPassword || newPassword.length < 4) {
            alert('새 비밀번호는 4자 이상이어야 합니다.');
            return;
        }
        updateAdminPassword(newPassword);
        alert('관리자 비밀번호가 변경되었습니다.');
        setNewPassword('');
        setCurrentPasswordInput('');
    };

    const handleConnectInstagram = () => {
        if (!handleInput) return;
        setIsVerifying(true);
        // Simulate API verification
        setTimeout(() => {
            // Remove @ if present
            const cleanHandle = handleInput.startsWith('@') ? handleInput : `@${handleInput}`;
            connectInstagram(cleanHandle);
            setIsVerifying(false);
            setHandleInput('');
            alert('Instagram 계정이 성공적으로 연결되었습니다!');
        }, 1500);
    };

    const handleAddCategoryClick = () => {
        if (!newCatName || !newCatPrefix) {
            alert('분류명과 코드를 모두 입력해주세요.');
            return;
        }
        if (categories.some(c => c.prefix === newCatPrefix)) {
            alert('이미 존재하는 코드 접두어입니다.');
            return;
        }
        // Open Modal
        setModalConfig({
            type: 'ADD',
            title: '분류 추가',
            message: `'${newCatName}' (${newCatPrefix}) 분류를 추가하시겠습니까?`,
            data: { name: newCatName, prefix: newCatPrefix }
        });
        setIsModalOpen(true);
    };

    const handleDeleteCategoryClick = (id: string, name: string) => {
        setModalConfig({
            type: 'DELETE',
            title: '분류 삭제',
            message: `'${name}' 분류를 삭제하시겠습니까?`,
            data: { id }
        });
        setIsModalOpen(true);
    }

    const handleConfirm = () => {
        if (!modalConfig) return;

        if (modalConfig.type === 'ADD') {
            addCategory(modalConfig.data.name, modalConfig.data.prefix);
            setNewCatName('');
            setNewCatPrefix('');
        } else if (modalConfig.type === 'DELETE') {
            deleteCategory(modalConfig.data.id);
        }

        // Close modal and reset
        setIsModalOpen(false);
        setModalConfig(null);
    };

    return (
        <div className="space-y-6 pb-20 relative">
            <ConfirmationModal
                isOpen={isModalOpen}
                title={modalConfig?.title || ''}
                message={modalConfig?.message || ''}
                onConfirm={handleConfirm}
                onCancel={() => setIsModalOpen(false)}
            />

            <h1 className="text-2xl font-bold text-sage-900">설정 (Settings)</h1>

            {/* 1. Instagram Connection Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-sand-200">
                <h2 className="text-lg font-medium text-sage-800 mb-4 flex items-center gap-2">
                    <span>📸</span> Instagram 연동
                </h2>

                {instagramConfig.connected ? (
                    <div className="flex items-center gap-4 p-4 bg-terracotta-50 rounded-xl border border-terracotta-100 animate-in zoom-in duration-300">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl border border-terracotta-200 shadow-sm">
                            <span className="animate-bounce">👋</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-terracotta-600 font-medium bg-terracotta-100 px-2 py-0.5 rounded-full">Connected</p>
                            </div>
                            <p className="text-lg font-bold text-terracotta-900 tracking-wide mt-1">{instagramConfig.handle}</p>
                            <p className="text-xs text-terracotta-500 mt-1">
                                연결일: {instagramConfig.connectedAt ? new Date(instagramConfig.connectedAt).toLocaleDateString() : '-'}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                if (confirm('정말 연결을 해제하시겠습니까?')) disconnectInstagram();
                            }}
                            className="px-4 py-2 bg-white text-terracotta-600 border border-terracotta-200 rounded-lg text-xs font-medium hover:bg-terracotta-50 transition-colors"
                        >
                            연결 해제
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-sage-600 bg-sand-50 p-3 rounded-lg border border-sand-100">
                            주문 알림을 받고 고객과 소통할 Instagram 계정을 연결해주세요.<br />
                            <span className="text-xs text-sage-400 mt-1 block">* 현재는 시뮬레이션 모드로 동작합니다.</span>
                        </p>
                        <div className="flex gap-2">
                            <div className="relative flex-1 group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400 font-medium group-focus-within:text-terracotta-500 transition-colors">@</span>
                                <input
                                    type="text"
                                    placeholder="your_shop_id"
                                    className="w-full pl-8 p-3 bg-sand-50 border border-sand-200 rounded-xl focus:ring-2 focus:ring-terracotta-500 focus:border-transparent outline-none transition-all placeholder:text-sand-300"
                                    value={handleInput}
                                    onChange={(e) => setHandleInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleConnectInstagram()}
                                />
                            </div>
                            <button
                                onClick={handleConnectInstagram}
                                disabled={!handleInput || isVerifying}
                                className={`px-6 py-3 rounded-xl font-bold text-white transition-all shadow-sm
                                    ${isVerifying
                                        ? 'bg-sand-400 cursor-wait'
                                        : 'bg-sage-700 hover:bg-sage-800 hover:shadow-md active:scale-95'
                                    }`}
                            >
                                {isVerifying ? '연결 중...' : '연결하기'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Admin Password Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-sand-200">
                <h2 className="text-lg font-medium text-sage-800 mb-4">🔐 관리자 비밀번호 변경</h2>
                <div className="space-y-3 max-w-sm">
                    <div>
                        <label className="block text-sm text-sage-600 mb-1">현재 비밀번호</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-sand-200 rounded-lg text-sm"
                            value={currentPasswordInput}
                            onChange={(e) => setCurrentPasswordInput(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-sage-600 mb-1">새 비밀번호</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-sand-200 rounded-lg text-sm"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="4자 이상 입력"
                        />
                    </div>
                    <button
                        onClick={handlePasswordUpdate}
                        className="w-full bg-sage-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-sage-700 transition-colors"
                    >
                        비밀번호 변경
                    </button>
                    <p className="text-xs text-sage-400">* 초기 비밀번호는 '1234' 입니다.</p>
                </div>
            </div>

            {/* 2. Product Category Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-sand-200">
                <h2 className="text-lg font-medium text-sage-800 mb-4">🏷️ 상품 분류 및 코드 관리</h2>
                <p className="text-sm text-sage-600 mb-4">
                    여기서 등록한 분류는 상품 등록 시 선택할 수 있으며, 코드 접두어(Prefix)로 상품 코드가 자동 생성됩니다.
                </p>

                {/* Add Form */}
                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        placeholder="분류명 (예: Dress)"
                        className="flex-1 p-2 border border-sand-200 rounded-lg text-sm"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="코드 (예: DR)"
                        className="w-24 p-2 border border-sand-200 rounded-lg text-sm uppercase"
                        value={newCatPrefix}
                        onChange={(e) => setNewCatPrefix(e.target.value.toUpperCase())}
                        maxLength={3}
                    />
                    <button
                        onClick={handleAddCategoryClick}
                        className="bg-sage-700 text-white px-4 rounded-lg text-sm font-medium hover:bg-sage-800 transition-colors shadow-sm"
                    >
                        추가
                    </button>
                </div>

                {/* List */}
                <div className="space-y-2">
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex justify-between items-center p-3 bg-sand-50 rounded-lg border border-sand-100">
                            <div className="flex items-center gap-3">
                                <span className="bg-white text-sage-800 font-bold px-2 py-1 rounded text-xs border border-sand-200">
                                    {cat.prefix}
                                </span>
                                <span className="text-sm text-sage-700 font-medium">{cat.name}</span>
                            </div>
                            <button
                                onClick={() => handleDeleteCategoryClick(cat.id, cat.name)}
                                className="text-xs text-red-400 hover:text-red-600 underline"
                            >
                                삭제
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Developer Tools (Simulation) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-sand-200">
                <h2 className="text-lg font-medium text-sage-800 mb-4">🤖 자동화 테스트 (Developer)</h2>
                <p className="text-sm text-sage-600 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100 text-blue-800">
                    웹사이트 등 외부에서 주문이 들어오는 상황을 시뮬레이션합니다.<br />
                    아래 버튼을 누르면 임의의 주문이 자동으로 생성됩니다.
                </p>
                <button
                    onClick={() => {
                        simulateWebOrder();
                        alert('가상의 웹 주문이 생성되었습니다! "배송 관리" 탭에서 확인하세요.');
                    }}
                    className="w-full py-3 bg-white border-2 border-dashed border-sage-300 text-sage-600 rounded-xl font-bold hover:bg-sage-50 hover:border-sage-400 transition-all"
                >
                    🪄 웹 주문 시뮬레이션 실행
                </button>
            </div>
        </div >
    );
}
