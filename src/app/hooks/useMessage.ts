import { useState, useEffect } from 'react';
import { getMessages } from '../lib/firebase';

interface ChatMessage {
    id: string;
    uid: string;
    displayName: string;
    text: string;
    timestamp: Date;
}

export function useMessages(roomId: string): ChatMessage[] {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        const unsubscribe = getMessages(roomId, setMessages);
        return () => unsubscribe();
    }, [roomId]);

    return messages;
}

export type { ChatMessage };