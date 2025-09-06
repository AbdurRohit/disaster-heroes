import { DisasterInfo } from "@/app/member/page";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { useState } from "react";
//create the interface of disasters 
// pass it as a prop to the component disaster = disasterInterface


export default function ChatRoom({disasters,selectedId}: DisasterInfo) {
  const [isExpanded, setIsExpanded] = useState(false);
  const room = disasters.find((x) => x.id === selectedId);
  
  if (!room) {
    // TODO: 404
    return null;
  }

  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const description = isExpanded ? room.description : truncateText(room.description || '', 10);
  
  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="p-4 border-b">                   
          <h1 className="text-xl text-footer font-bold">{room?.title}</h1>
          <div className="relative">
            <p className="text-sm text-gray-500">{description}</p>
            {room.description && room.description.split(' ').length > 10 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-blue-500 hover:text-blue-600 mt-1 focus:outline-none"
              >
                {isExpanded ? 'See less' : 'See more'}
              </button>
            )}
          </div>
      </div>
      <div className="mb-3 pb-5">
          <div className="">
              <MessageList roomId={selectedId} />
          </div>
          <div className="">
              <MessageInput roomId={selectedId} />
          </div>
      </div>
    </div>
  );
}