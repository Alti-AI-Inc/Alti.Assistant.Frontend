
export type Property = {
  id: string;
  streetAddress: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  area: number;
  imageUrl: string;
  yearBuilt: number;
  otherImages?: string[];
};

export const properties: Property[] = [
  {
    id: "1",
    streetAddress: "123 Main St",
    location: "New York, NY",
    price: "$10,000,000",
    beds: 3,
    baths: 2,
    area: 1500,
    yearBuilt: 2010,
    imageUrl: "/assets/property1.jpg",
    otherImages: ["/assets/property2.jpg", "/assets/property3.webp", "/assets/property4.jpg"],
  },
  {
    id: "2",
    streetAddress: "456 Elm St",
    location: "Los Angeles, CA",
    price: "$800,000",
    beds: 4,
    baths: 3,
    area: 2000,
    yearBuilt: 2015,
     imageUrl: "/assets/property2.jpg",
  },
  {
    id: "3",
    streetAddress: "789 Oak St",
    location: "Chicago, IL",
    price: "$1,500,000",
    beds: 2,
    baths: 2,
    area: 1200,
    yearBuilt: 2005,
   imageUrl: "/assets/property3.webp",
  },
  {
    id: "4",
    streetAddress: "987 Pine St",
    location: "Houston, TX",
    price: "$1,200,000",
    beds: 4,
    baths: 2,
    area: 1800,
    yearBuilt: 2018,
   imageUrl: "/assets/property4.jpg",
  },
  {
    id: "5",
    streetAddress: "654 Maple St",
    location: "Philadelphia, PA",
    price: "$1,100,000",
    beds: 3,
    baths: 2,
    area: 1500,
    yearBuilt: 2012,
   imageUrl: "/assets/property5.webp",
  },
  {
    id: "6",
    streetAddress: "321 Cedar St",
    location: "San Francisco, CA",
    price: "$2,000,000",
    beds: 3,
    baths: 3,
    area: 1600,
    yearBuilt: 2020,
   imageUrl: "/assets/property6.jpg",
  },
  {
    id: "7",
    streetAddress: "159 Birch St",
    location: "Miami, FL",
    price: "$900,000",
    beds: 2,
    baths: 2,
    area: 1300,
    yearBuilt: 2011,
   imageUrl: "/assets/property7.webp",
  },
  
]
