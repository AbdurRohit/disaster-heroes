'use client';

import React, { useRef, useLayoutEffect } from 'react';
import { useMessages } from '../../hooks/useMessage';
import { useSession } from 'next-auth/react';
import { Timestamp } from 'firebase/firestore';
import { formatMessageTime } from '../../hooks/formatMessageTime';

interface ChatMessage {
    id: string;
    uid: string;
    displayName: string;
    text: string;
    timestamp: Timestamp | null;
}

interface MessageListProps {
    roomId: string;
}

interface MessageProps {
    message: ChatMessage;
    isOwnMessage: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isOwnMessage }) => {
    const { displayName, text, timestamp } = message;
    const messageTime = formatMessageTime(timestamp);

    return (
        <li className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[70%] ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-100'} rounded-2xl px-4 py-2 shadow-sm`}>
                <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-medium ${isOwnMessage ? 'text-blue-50' : 'text-gray-700'}`}>
                        {isOwnMessage ? 'You' : displayName}
                    </h4>
                    <span className={`text-xs ${isOwnMessage ? 'text-blue-200' : 'text-gray-500'}`}>
                        {messageTime}
                    </span>
                </div>
                <div className={`mt-1 text-sm ${isOwnMessage ? 'text-white' : 'text-gray-800'}`}>
                    {text}
                </div>
            </div>
        </li>
    );
};

const MessageList: React.FC<MessageListProps> = ({ roomId }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();
    const messages = useMessages(roomId);

    useLayoutEffect(() => {
        const scrollToBottom = () => {
            if (containerRef.current) {
                const scrollOptions: ScrollToOptions = {
                    top: containerRef.current.scrollHeight,
                    behavior: 'smooth'
                };
                containerRef.current.scrollTo(scrollOptions);
            }
        };

        scrollToBottom();

        // Add a slight delay to handle dynamic content loading
        const timeoutId = setTimeout(scrollToBottom, 100);
        
        return () => clearTimeout(timeoutId);
    }, [messages]); // Scroll when messages update

    return (
        <div 
            className="h-[calc(100vh-360px)] px-4 py-2 overflow-y-auto" 
            ref={containerRef}
        >
            {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                    <p>No messages yet. Start the conversation!</p>
                </div>
            ) : (
                <ul className="min-h-full flex flex-col">
                    {messages.map((message: ChatMessage) => (
                        <Message
                            key={message.id}
                            message={message}
                            isOwnMessage={message.uid === session?.user?.email}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export { MessageList };