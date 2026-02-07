import { mockInventory, mockOrders } from './mockData';

export interface InstagramMessage {
    id: string;
    username: string;
    content: string;
    timestamp: string;
    isComplaint: boolean; // AI Classification
    aiAnalysis: string;   // Internal AI note
    suggestedReply?: string;
    status: 'Auto_Replied' | 'Manual_Required';
}

// Simulated Gemini AI Analysis
export function analyzeMessage(message: string, username: string): Omit<InstagramMessage, 'id' | 'username' | 'content' | 'timestamp'> {
    // 1. Complaint Detection (Simulated)
    const complaintKeywords = ['늦게', '안와요', '환불', '엉망', '짜증'];
    const isComplaint = complaintKeywords.some(keyword => message.includes(keyword));

    if (isComplaint) {
        return {
            isComplaint: true,
            status: 'Manual_Required',
            aiAnalysis: '🚨 불만/항의성 메시지로 감지됨. 자동 응답을 차단했습니다.',
        };
    }

    // 2. Intent Recognition & Data Query (Simulated)
    // shipping query
    if (message.includes('배송') || message.includes('언제')) {
        // Search by Name OR Instagram ID (stripping @ if needed)
        const userOrder = mockOrders.find(o =>
            o.customerName === username ||
            (o.instagramId && o.instagramId.replace('@', '') === username)
        );

        if (userOrder) {
            const reply = userOrder.status === 'Shipped'
                ? `고객님의 주문 상품은 ${userOrder.shippingDate}에 발송되었습니다. 운송장 번호는 ${userOrder.trackingNumber}입니다.`
                : `현재 주문 확인 중이며, 곧 발송 예정입니다. 조금만 기다려주세요!`;
            return {
                isComplaint: false,
                status: 'Auto_Replied',
                aiAnalysis: `📦 배송 문의 감지. 주문 데이터(ID/Name Matching)를 조회하여 자동 응답했습니다.`,
                suggestedReply: reply
            };
        }
    }

    // inventory query
    if (message.includes('재고') || message.includes('있나요')) {
        // Simple logic: check if any product name is partially matched in message
        const product = mockInventory.find(p => message.includes(p.productName) || message.includes(p.productName.split(' ')[0])); // naive matching

        if (product) {
            const stockMsg = product.stock > 0
                ? `네! '${product.productName}' 제품은 현재 ${product.stock}개 남아있어 바로 주문 가능합니다.`
                : `죄송합니다. '${product.productName}' 제품은 현재 품절입니다.${product.restockDate ? ` ${product.restockDate}에 재입고 예정입니다.` : ''}`;

            return {
                isComplaint: false,
                status: 'Auto_Replied',
                aiAnalysis: `👗 재고 문의 감지. '${product.productName}' 재고(${product.stock}개)를 확인하여 자동 응답했습니다.`,
                suggestedReply: stockMsg
            };
        }

        return {
            isComplaint: false,
            status: 'Auto_Replied',
            aiAnalysis: '👗 재고 문의 감지. 정확한 상품명을 찾지 못해 전체 안내를 전송했습니다.',
            suggestedReply: '문의주신 상품의 정확한 제품명을 알려주시면 재고를 확인해 드리겠습니다!'
        };
    }

    // Default Fallback
    return {
        isComplaint: false,
        status: 'Auto_Replied',
        aiAnalysis: '💬 일반 문의 감지. 기본 인사말을 전송했습니다.',
        suggestedReply: '안녕하세요, 들꽃이야기입니다. 문의 남겨주셔서 감사합니다. 곧 확인 후 답변 드리겠습니다!'
    };
}

export const mockMessages: InstagramMessage[] = [
    {
        id: 'm1', username: '김민지', timestamp: '10:30 AM', content: '배송 언제 되나요?',
        ...analyzeMessage('배송 언제 되나요?', '김민지')
    },
    {
        id: 'm2', username: '박진상', timestamp: '11:15 AM', content: '옷이 너무 늦게 오잖아요! 환불해줘요!',
        ...analyzeMessage('옷이 너무 늦게 오잖아요! 환불해줘요!', '박진상')
    },
    {
        id: 'm3', username: '최수정', timestamp: '12:00 PM', content: '자수 에코백 재고 있나요?',
        ...analyzeMessage('자수 에코백 재고 있나요?', '최수정') // Note: In logic we might want to actually check specific mapping but simple logic for now
    }
] as InstagramMessage[]; // Cast needed because we are constructing it dynamically
