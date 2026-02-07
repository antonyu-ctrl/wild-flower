import { useState } from 'react';
import { useData } from '../context/DataContext';

export default function Settings() {
    const { adminPassword, updateAdminPassword, categories, addCategory, deleteCategory } = useData();

    // Password State
    const [newPassword, setNewPassword] = useState('');
    const [currentPasswordInput, setCurrentPasswordInput] = useState('');

    // Category State
    const [newCatName, setNewCatName] = useState('');
    const [newCatPrefix, setNewCatPrefix] = useState('');

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

    const handleAddCategory = () => {
        if (!newCatName || !newCatPrefix) {
            alert('분류명과 코드를 모두 입력해주세요.');
            return;
        }
        if (categories.some(c => c.prefix === newCatPrefix)) {
            alert('이미 존재하는 코드 접두어입니다.');
            return;
        }
        addCategory(newCatName, newCatPrefix);
        setNewCatName('');
        setNewCatPrefix('');
    };

    return (
        <div className="space-y-6 pb-20">
            <h1 className="text-2xl font-bold text-sage-900">설정 (Settings)</h1>

            {/* 1. Admin Password Section */}
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
                        onClick={handleAddCategory}
                        className="bg-terra-500 text-white px-4 rounded-lg text-sm font-medium hover:bg-terra-600"
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
                                onClick={() => {
                                    if (confirm(`'${cat.name}' 분류를 삭제하시겠습니까?`)) {
                                        deleteCategory(cat.id);
                                    }
                                }}
                                className="text-xs text-red-400 hover:text-red-600 underline"
                            >
                                삭제
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
