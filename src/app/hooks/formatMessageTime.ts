import { Timestamp } from "firebase/firestore";

export const formatMessageTime = (timestamp?: Timestamp | null) => {
    if (!timestamp) return ""; // or "Unknown" or ""

    const messageDate = timestamp.toDate();
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
        return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
        return 'Yesterday ' + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays < 7) {
        return messageDate.toLocaleDateString([], { weekday: 'short' }) + ' ' +
               messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
        return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
               messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
};