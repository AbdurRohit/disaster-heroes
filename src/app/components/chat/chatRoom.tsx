import { useParams } from "next/navigation"
import { DisasterInfo } from "@/app/member/page";
//create the interface of disasters 
// pass it as a prop to the component disaster = disasterInterface


export default function ChatRoom({disasters,selectedId}: DisasterInfo) {
   
  const params = useParams();
  const room = disasters.find((x) => x.id === selectedId);
    if (!room) {
        // TODO: 404
    }
  
  // const room = disasters[id]; // TODO: replace with actual room data based on params.id
  return (
    <div>
      <h1 className="text-red-500"> this is Chat Room CHAT..</h1>
            <div>
                <h1 className="text-2xl font-bold">{room?.title}</h1>
                <p className="text-sm text-gray-500">{room?.description}</p>
            </div>
            <div className="messages-container">{/* TODO */}</div>
    </div>
  );
}