import { properties, Property } from '@/lib/properties';
import { formatArea } from '@/lib/utils';
import { Bath, Bed } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const page = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-4 mt-6">
        {properties.map(property => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </div>
    </div>
  );
};

const PropertyCard = ({
  id,
  streetAddress,
  location,
  price,
  beds,
  baths,
  area,
  imageUrl,
}: Property) => {
 
  return (
    <div>
      <Link
        key={id}
        href={`/saved-listings/${id}`}
        className="group flex w-full flex-col overflow-hidden rounded-xl shadow-md"
        target="_blank"
      >
        <figure className="h-52 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt="property"
            width={400}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </figure>
        <div className="flex flex-1 flex-col justify-between gap-3 pt-3">
          <div className="flex items-end gap-2 px-3">
            <div className="flex flex-1 flex-col gap-1">
              <h3 className="text-lg font-semibold text-zinc-900">
                {streetAddress}
              </h3>
              <p className="text-sm text-zinc-600">{location}</p>
            </div>
            <p className="text-sm text-zinc-600">{price}</p>
          </div>
          <div className="flex flex-col gap-2 bg-gray-100 p-3">
            <div className="flex items-center justify-between gap-2 text-sm text-zinc-900">
              <div className="flex items-center space-x-2">
                <Bed className="size-6 text-gray-600" />
                <span> {beds} Bed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bath className="size-6 text-gray-600" />
                <span> {baths} Bath</span>
              </div>
              <div className="flex items-center space-x-2">
                {/* <RulerDimensionLine className="text-gray-600 size-5" /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4a5565"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-vector-square-icon lucide-vector-square"
                >
                  <path d="M19.5 7a24 24 0 0 1 0 10" />
                  <path d="M4.5 7a24 24 0 0 0 0 10" />
                  <path d="M7 19.5a24 24 0 0 0 10 0" />
                  <path d="M7 4.5a24 24 0 0 1 10 0" />
                  <rect x="17" y="17" width="5" height="5" rx="1" />
                  <rect x="17" y="2" width="5" height="5" rx="1" />
                  <rect x="2" y="17" width="5" height="5" rx="1" />
                  <rect x="2" y="2" width="5" height="5" rx="1" />
                </svg>
                <span> {formatArea(area)} Sq Ft</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default page;
