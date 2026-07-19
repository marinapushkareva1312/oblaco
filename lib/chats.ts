export type ChatMessage = {
  id: string
  text: string
  translated?: string
  sender: "me" | "them"
  time: string
}

export type Conversation = {
  id: string
  sellerName: string
  sellerInitial: string
  listingTitle: string
  listingPrice: string
  lastMessage: string
  lastMessageTime: string
  unread: number
  messages: ChatMessage[]
}

export const conversations: Conversation[] = [
  {
    id: "1",
    sellerName: "Anna K.",
    sellerInitial: "A",
    listingTitle: "IKEA desk & chair",
    listingPrice: "₩45,000",
    lastMessage: "Can you lower the price a little?",
    lastMessageTime: "10:33 AM",
    unread: 1,
    messages: [
      { id: "1", text: "Hi! Is the desk still available?", sender: "them", time: "10:30 AM" },
      { id: "2", text: "Yes it is! Come check it out anytime 😊", sender: "me", time: "10:32 AM" },
      {
        id: "3",
        text: "가격 조금 낮춰줄 수 있나요?",
        translated: "Can you lower the price a little?",
        sender: "them",
        time: "10:33 AM",
      },
    ],
  },
  {
    id: "2",
    sellerName: "Min-jun P.",
    sellerInitial: "M",
    listingTitle: "Carbon Road Bike",
    listingPrice: "₩680,000",
    lastMessage: "Sounds good, see you Saturday!",
    lastMessageTime: "Yesterday",
    unread: 0,
    messages: [
      { id: "1", text: "Is this still for sale?", sender: "me", time: "9:10 AM" },
      { id: "2", text: "Yep! Still available.", sender: "them", time: "9:15 AM" },
      { id: "3", text: "Can I come check it out Saturday morning?", sender: "me", time: "9:16 AM" },
      { id: "4", text: "Sounds good, see you Saturday!", sender: "them", time: "9:20 AM" },
    ],
  },
  {
    id: "3",
    sellerName: "Soo-ah L.",
    sellerInitial: "S",
    listingTitle: "UltraSlim Pro Laptop",
    listingPrice: "₩1,420,000",
    lastMessage: "네, 아직 판매 중이에요!",
    lastMessageTime: "2d ago",
    unread: 2,
    messages: [
      { id: "1", text: "Hello, is the laptop still for sale?", sender: "me", time: "Mon 3:00 PM" },
      {
        id: "2",
        text: "네, 아직 판매 중이에요!",
        translated: "Yes, still for sale!",
        sender: "them",
        time: "Mon 3:12 PM",
      },
    ],
  },
]

export function getConversation(id: string): Conversation | undefined {
  return conversations.find((c) => c.id === id)
}
