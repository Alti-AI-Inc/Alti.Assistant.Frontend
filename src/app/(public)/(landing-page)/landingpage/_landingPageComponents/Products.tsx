const Products = () => {
  return (
    <div className="mx-auto mt-18 max-w-(--breakpoint-xl) space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-100 w-[60%] bg-gray-100"></div>
        <div className="h-100 w-[40%]"></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="h-100 w-[40%]"></div>
        <div className="h-100 w-[60%] bg-gray-100"></div>
      </div>
    </div>
  );
};

export default Products;
