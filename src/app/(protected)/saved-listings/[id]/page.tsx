
import { Button } from '@/components/ui/button';
import { properties } from '@/lib/properties';
import { formatArea } from '@/lib/utils';
import { Bath, Bed, Calendar } from 'lucide-react';
import Image from 'next/image';
import ChatWithProperty from './components/ChatWithProperty';


export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const propertyDetail = properties.find(property => property.id === id);

  return propertyDetail ? (
    <main className="flex h-screen w-full gap-x-2 overflow-hidden bg-white p-6">
      <div className="h-[calc(100vh-28px)] w-7/12 overflow-y-scroll rounded-md bg-gray-100 p-4">
        <Image
          src={propertyDetail.imageUrl}
          alt="property"
          width={600}
          height={400}
          className="h-60 w-full rounded-md object-cover"
        />
        <div className="relative mt-4 grid grid-cols-3 gap-x-2">
          {propertyDetail.otherImages?.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt="property"
              width={600}
              height={400}
              className="h-60 w-full rounded-md object-cover"
            />
          ))}

          <Button
            size="lg"
            className="absolute right-[7%] bottom-6 border border-gray-300 bg-white text-black transition-all hover:scale-105 hover:bg-gray-200"
          >
            See all photos
          </Button>
        </div>
        <div className="mt-10 grid grid-cols-3 gap-x-2">
          <div className="col-span-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {propertyDetail.price.toLocaleString()}
            </h1>
            <p className="mt-2 text-2xl font-medium text-gray-700">
              {propertyDetail.streetAddress}
            </p>
            <p className="mt-1 text-xl text-gray-600">
              {propertyDetail.location}
            </p>
          </div>
          <div className="col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-md bg-white p-4">
                <Bed className="size-8 text-gray-600" />
                <span className="text-lg text-gray-600">
                  {' '}
                  {propertyDetail.beds} Bed
                </span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-white p-4">
                <Bath className="size-8 text-gray-600" />
                <span className="text-lg text-gray-600">
                  {' '}
                  {propertyDetail.baths} Bath
                </span>
              </div>
              <div className="col-span-1 rounded-md bg-white p-4">
                <div className="flex items-center justify-between space-x-2">
                  {/* <RulerDimensionLine className="text-gray-600 size-5" /> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
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
                  <span className="text-lg text-gray-600">
                    {' '}
                    {formatArea(propertyDetail.area)} Sq Ft
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md bg-white p-4">
                <Calendar className="size-7 text-gray-600" />
                <span className="text-lg text-gray-600">
                  {' '}
                  {propertyDetail.yearBuilt} Built{' '}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 rounded-md bg-white p-4">
          <h3 className="text-2xl font-bold">Property Description</h3>
          <p className="mt-2">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Exercitationem ullam laborum maiores, accusamus architecto ipsum
            fugit. Repellat fugiat unde beatae molestiae doloremque quae cum
            atque ullam, placeat quo illo doloribus cupiditate incidunt
            perferendis velit eveniet repellendus dolores eius quaerat. Earum
            quo nesciunt magni molestias quasi mollitia consequuntur, quas
            ducimus veniam ex accusamus quisquam soluta ipsa, voluptates rem
            esse tenetur, consectetur eligendi tempore qui itaque? Nostrum error
            quis amet eligendi inventore eaque voluptate et magni nesciunt minus
            distinctio dolorum, praesentium non nisi perferendis ex,
            perspiciatis, dolores neque dignissimos cum quas quidem asperiores
            accusamus. Odit eum tempore, est cumque nesciunt iure ut. Lorem,
            ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
          </p>
        </div>
        <div className="mt-10 bg-white p-4">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114964.38947215323!2d-80.30796629642519!3d25.78254527586529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b0d6996eaabf%3A0x9854134a00298350!2sMiami%20Cheapest%20Place!5e0!3m2!1sen!2s!4v1756363658858!5m2!1sen!2s"
            // width="600"
            // height="450"
            className="size-full h-96 w-full rounded-md border-0"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <ChatWithProperty />
    </main>
  ) : (
    <></>
  );
};


