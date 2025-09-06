'use client';

import { FormEvent, ChangeEvent } from 'react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { sendMessage } from '@/app/lib/firebase';

interface MessageInputProps {
    roomId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ roomId }) => {
    const { data: session } = useSession();
    const [message, setMessage] = useState<string>('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setMessage(event.target.value);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        
        if (!session?.user || !message.trim()) {
            return;
        }

        try {
            await sendMessage(roomId, {
                name: session.user.name || null,
                email: session.user.email || null,
                image: session.user.image || null
            }, message.trim());
            setMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
            // error handling UI 
        }
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="absolute bottom-0 text-footer left-0 w-full p-4 pr-8"
        >
            <div className="flex gap-2 max-w-4xl mx-auto">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={1}
                />
                <button
                    type="submit"
                    disabled={!message.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Send
                </button>
            </div>
        </form>
    );
};

export { MessageInput };