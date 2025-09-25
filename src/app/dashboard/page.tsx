import { columns, data } from './_components/columns';
import { DataTable } from './_components/data-table';

const page = () => {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Members</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default page;
