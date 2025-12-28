import { columns, data } from "./columns";
import { DataTable } from "./data-table";



export default function Page() {
  return (
    <div className="min-h-screen px-6 py-6">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
