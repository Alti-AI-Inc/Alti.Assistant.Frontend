import Image from 'next/image';

const industries = [
  { icon: '/assets/industries-icons/construction.svg', title: 'Construction' },
  { icon: '/assets/industries-icons/architecture.svg', title: 'Architecture' },
  // { icon: '🏢', title: 'Real Estate' },
  // { icon: '🧮', title: 'Engineering' },
  // { icon: '⚙️', title: 'Manufacturing' },
  // { icon: '🚗', title: 'Automotive' },
  // { icon: '✈️', title: 'Aerospace' },
  // { icon: '🚛', title: 'Logistics' },
  // { icon: '⚡', title: 'Energy' },
  // { icon: '🛢️', title: 'Oil' },
  // { icon: '⛏️', title: 'Mining' },
  // { icon: '💧', title: 'Utilities' },
];

const Industries = () => {
  return (
    <div className="mx-auto mt-6 max-w-[1340px] items-start px-4">
      <div className="grid grid-cols-4 gap-6">
        {industries.map(item => (
          <div
            key={item.title}
            className="flex items-center space-x-4 rounded-md bg-gray-100 p-4"
          >
            <Image src={item.icon} alt={item.title} width={50} height={50} />
            <div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              {/* <p className="text-muted-foreground text-sm">
                {item.description}
              </p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Industries;
