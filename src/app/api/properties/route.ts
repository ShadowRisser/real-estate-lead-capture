import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const PROPERTIES_DATA = [
  {
    id: 'prop-1',
    title: 'Oceanfront Villa Serenity',
    description: 'Breathtaking oceanfront villa featuring an infinity pool that merges with the horizon. This architectural masterpiece offers panoramic Pacific views, imported Italian marble throughout, and a chef\'s kitchen with Gaggenau appliances. The resort-style outdoor living includes a covered lanai, outdoor kitchen, and direct beach access.',
    price: 4850000,
    address: '1200 Coastal Highway',
    city: 'Malibu',
    state: 'CA',
    bedrooms: 5,
    bathrooms: 6,
    sqft: 7200,
    lotSize: '0.75 acres',
    yearBuilt: 2022,
    propertyType: 'Villa',
    status: 'available',
    featured: true,
    imageUrl: '/images/property-1.png',
  },
  {
    id: 'prop-2',
    title: 'The Skyline Penthouse',
    description: 'Perched on the 52nd floor, this ultra-luxury penthouse offers 360° skyline views from every room. Features include 14-foot ceilings, a private elevator, smart home automation by Crestron, a wine cellar, and a private rooftop terrace with a Jacuzzi. Designed by world-renowned interior designer Kelly Hoppen.',
    price: 12500000,
    address: '1 Tower Place, PH5200',
    city: 'Manhattan',
    state: 'NY',
    bedrooms: 4,
    bathrooms: 5,
    sqft: 6800,
    lotSize: 'N/A',
    yearBuilt: 2023,
    propertyType: 'Penthouse',
    status: 'available',
    featured: true,
    imageUrl: '/images/property-2.png',
  },
  {
    id: 'prop-3',
    title: 'Heritage Oak Estate',
    description: 'A stately craftsman estate nestled among century-old oak trees. This 8-bedroom residence features a grand foyer, formal dining room, library with custom built-ins, and a gourmet kitchen. The grounds include a heated pool, tennis court, guest house, and meticulously landscaped gardens spanning three acres.',
    price: 3200000,
    address: '450 Heritage Lane',
    city: 'Greenwich',
    state: 'CT',
    bedrooms: 8,
    bathrooms: 7,
    sqft: 9500,
    lotSize: '3.2 acres',
    yearBuilt: 2019,
    propertyType: 'Estate',
    status: 'available',
    featured: true,
    imageUrl: '/images/property-3.png',
  },
  {
    id: 'prop-4',
    title: 'Desert Modern Masterpiece',
    description: 'A stunning example of desert modernism, this smart home features floor-to-ceiling glass walls that blur the line between indoor and outdoor living. Equipped with full solar power, a Tesla Powerwall system, and automated everything. The minimalist design includes a negative-edge pool, fire pit area, and mountain views.',
    price: 2750000,
    address: '88 Desert Ridge Drive',
    city: 'Scottsdale',
    state: 'AZ',
    bedrooms: 4,
    bathrooms: 4,
    sqft: 5200,
    lotSize: '1.1 acres',
    yearBuilt: 2024,
    propertyType: 'Modern',
    status: 'available',
    featured: true,
    imageUrl: '/images/property-4.png',
  },
  {
    id: 'prop-5',
    title: 'Tuscan Riviera Retreat',
    description: 'Inspired by the villas of the Italian coast, this Mediterranean masterpiece features hand-painted frescoes, a central courtyard with a tiered fountain, and a professional-grade outdoor kitchen. The residence includes a wine grotto, home theater, spa with sauna, and panoramic ocean views from the master suite terrace.',
    price: 6200000,
    address: '700 Cliffside Road',
    city: 'Santa Barbara',
    state: 'CA',
    bedrooms: 6,
    bathrooms: 8,
    sqft: 8500,
    lotSize: '2.0 acres',
    yearBuilt: 2021,
    propertyType: 'Mediterranean',
    status: 'available',
    featured: true,
    imageUrl: '/images/property-5.png',
  },
  {
    id: 'prop-6',
    title: 'Lakeside Timber Lodge',
    description: 'A modern interpretation of the classic lake lodge, this retreat features exposed timber beams, massive stone fireplaces, and walls of glass overlooking a pristine private lake. Includes a boat house, private dock, hiking trails, and a chef\'s kitchen. Perfect as a primary residence or luxury getaway.',
    price: 1950000,
    address: '15 Lakeshore Drive',
    city: 'Lake Tahoe',
    state: 'CA',
    bedrooms: 5,
    bathrooms: 4,
    sqft: 4800,
    lotSize: '4.5 acres',
    yearBuilt: 2023,
    propertyType: 'Lodge',
    status: 'available',
    featured: true,
    imageUrl: '/images/property-6.png',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const city = searchParams.get('city');
  const bedrooms = searchParams.get('bedrooms');
  const featured = searchParams.get('featured');

  let filtered = [...PROPERTIES_DATA];

  if (type && type !== 'all') {
    filtered = filtered.filter((p) => p.propertyType.toLowerCase() === type.toLowerCase());
  }
  if (minPrice) {
    filtered = filtered.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter((p) => p.price <= Number(maxPrice));
  }
  if (city && city !== 'all') {
    filtered = filtered.filter((p) => p.city.toLowerCase().includes(city.toLowerCase()));
  }
  if (bedrooms) {
    filtered = filtered.filter((p) => p.bedrooms >= Number(bedrooms));
  }
  if (featured === 'true') {
    filtered = filtered.filter((p) => p.featured);
  }

  return NextResponse.json({
    success: true,
    properties: filtered,
    total: filtered.length,
  });
}
