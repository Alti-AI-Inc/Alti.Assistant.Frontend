const InfoBoxesContainer = ({
  title,
  box1Title,
  box2Title,
  box1Desc,
  box2Desc,
}: {
  title: string;
  box1Title: string;
  box2Title: string;
  box1Desc: string;
  box2Desc: string;
}) => {
  return (
    <div className="max-w-[500px]">
      <h2 className="font-secondary font-montserrat text-center text-[32px] leading-[56px] font-bold text-[#000] md:text-5xl lg:text-start">
        {title}
      </h2>
      <div className="mt-4 space-y-2 rounded-2xl bg-gray-100 p-4">
        <h3 className="text-2xl font-medium">{box1Title}</h3>
        <p>{box1Desc}</p>
      </div>
      <div className="mt-4 space-y-2 rounded-2xl bg-gray-100 p-4">
        <h3 className="text-2xl font-medium">{box2Title}</h3>
        <p>{box2Desc}</p>
      </div>
    </div>
  );
};

export default InfoBoxesContainer;
