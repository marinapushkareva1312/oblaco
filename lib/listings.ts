import { supabase } from './supabase'
import type { TranslationKey } from './translations'

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

// Extracts a comparable numeric value from a formatted price string
// (e.g. "₩320,000" -> 320000, "₩25,000/day" -> 25000, "Free" -> 0).
export function getPriceValue(price: string): number {
  const match = price.match(/[\d,]+/)
  if (!match) return 0
  return parseInt(match[0].replace(/,/g, ""), 10) || 0
}

export const categories: { id: string; labelKey: TranslationKey; emoji: string }[] = [
  { id: "all", labelKey: "catAll", emoji: "✨" },
  { id: "cars", labelKey: "catCars", emoji: "🚗" },
  { id: "pets", labelKey: "catPets", emoji: "🐾" },
  { id: "tech", labelKey: "catTech", emoji: "📱" },
  { id: "homes", labelKey: "catHomes", emoji: "🏠" },
  { id: "fashion", labelKey: "catFashion", emoji: "👟" },
  { id: "furniture", labelKey: "catFurniture", emoji: "🛋️" },
  { id: "bikes", labelKey: "catBikes", emoji: "🚲" },
  { id: "photo", labelKey: "catPhoto", emoji: "📷" },
]

// Static listings as fallback
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

// Fetch listings from Supabase
export async function fetchListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !data || data.length === 0) {
    console.error('Supabase error:', error)
    return listings // fallback to static data
  }

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    price: item.price,
    location: item.location,
    postedAt: new Date(item.created_at).toLocaleDateString(),
    image: item.image || '/listings/sofa.png',
    category: item.category,
    featured: item.featured,
  }))
}