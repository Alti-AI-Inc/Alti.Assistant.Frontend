import { columns, data } from "./columns";
import { DataTable } from "./data-table";



export default function Page() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Billing</h1>
       <DataTable columns={columns} data={data} />
    </div>
  );
}
