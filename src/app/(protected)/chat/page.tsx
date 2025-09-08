import { ArrowRight, Plus } from 'lucide-react';

export default function page() {
  return (
    <div className="mx-auto -mt-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center">
      <div className="mx-auto w-3xl">
        <h1 className="mb-4 text-center text-4xl font-semibold">
          How can I help you?
        </h1>
        <div>
          <form>
            <div className="rounded-2xl border-2 border-gray-200 px-4 shadow-sm">
              <input
                type="text"
                className="w-full border-none px-2 py-2 outline-none"
                placeholder="Chat with inso"
              />
              <div className="flex justify-between py-2">
                <Plus className="cursor-pointer rounded-full border-2 border-gray-300 p-0.5" />
                <ArrowRight
                  type="submit"
                  className="cursor-pointer rounded-full border-2 border-gray-300 bg-black p-0.5 text-white"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
