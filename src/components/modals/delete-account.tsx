import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function DeleteAccount() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full justify-start">Delete Account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <h1 className="text-center">
            Are you sure you want to delete your account?
          </h1>
          <div className="flex w-full justify-center gap-4">
            <Button>Delete</Button>
            <Button variant="destructive">Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
