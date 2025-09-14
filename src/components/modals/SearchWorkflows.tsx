import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
const SearchWorkflows = ({ hideSidebar }: { hideSidebar: boolean }) => {
  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          "flex w-full cursor-pointer items-start justify-start space-x-2 rounded-md bg-transparent px-2.5 py-2 text-sm text-black shadow-none hover:bg-black/5 flex-none",
          hideSidebar && "justify-center mr-0 px-0"
        )}
      >
        <Search className={cn("size-4.5", hideSidebar && "mr-0")} />{" "}
        <span className={cn(hideSidebar && "hidden")}>Search workflows</span>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Search workflows</DialogTitle>
          <DialogDescription>
            <Input
              placeholder="Search workflows..."
              className="w-full border-0 px-3 py-2 shadow-none focus:ring-0 focus-visible:ring-0"
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SearchWorkflows;
