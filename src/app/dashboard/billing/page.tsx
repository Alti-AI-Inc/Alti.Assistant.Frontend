import { columns, data } from './columns';
import { DataTable } from './data-table';

export default function Page() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Billing</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
