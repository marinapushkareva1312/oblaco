export type Listing = {
  id: string
  title: string
  price: string
  location: string
  postedAt: string
  image: string
  category: string
  featured?: boolean
}

export const categories = [
  { id: "all", label: "All", emoji: "✨" },
  { id: "cars", label: "Cars", emoji: "🚗" },
  { id: "pets", label: "Pets", emoji: "🐾" },
  { id: "tech", label: "Tech", emoji: "📱" },
  { id: "homes", label: "Homes", emoji: "🏠" },
  { id: "fashion", label: "Fashion", emoji: "👟" },
  { id: "furniture", label: "Furniture", emoji: "🛋️" },
  { id: "bikes", label: "Bikes", emoji: "🚲" },
  { id: "photo", label: "Photo", emoji: "📷" },
]

export const listings: Listing[] = [
  {
    id: "1",
    title: "Linen Comfort Sofa (Used)",
    price: "₩320,000",
    location: "Haeundae, Busan",
    postedAt: "2h ago",
    image: "/listings/sofa.png",
    category: "furniture",
    featured: true,
  },
  {
    id: "2",
    title: "Weekend Dog Sitter",
    price: "₩25,000/day",
    location: "Gwangalli, Busan",
    postedAt: "5h ago",
    image: "/listings/dog.png",
    category: "pets",
  },
  {
    id: "3",
    title: "Sunlit Room for Rent",
    price: "₩450,000/mo",
    location: "Seomyeon, Busan",
    postedAt: "1d ago",
    image: "/listings/apartment.png",
    category: "homes",
    featured: true,
  },
  {
    id: "4",
    title: "City Commuter Bicycle",
    price: "₩180,000",
    location: "Dongnae, Busan",
    postedAt: "3h ago",
    image: "/listings/bike.png",
    category: "bikes",
  },
  {
    id: "5",
    title: "Solid Oak Dining Table",
    price: "₩210,000",
    location: "Seoul",
    postedAt: "6h ago",
    image: "/listings/sofa.png",
    category: "furniture",
  },
  {
    id: "6",
    title: "UltraSlim Pro Laptop",
    price: "₩1,420,000",
    location: "Seomyeon, Busan",
    postedAt: "8h ago",
    image: "/listings/laptop.png",
    category: "tech",
  },
  {
    id: "7",
    title: "Studio Apartment for Rent",
    price: "₩550,000/mo",
    location: "Seoul",
    postedAt: "12h ago",
    image: "/listings/apartment.png",
    category: "homes",
  },
  {
    id: "8",
    title: "Carbon Road Bike",
    price: "₩680,000",
    location: "Haeundae, Busan",
    postedAt: "1d ago",
    image: "/listings/bike.png",
    category: "bikes",
  },
]
