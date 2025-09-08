import ContactForm from '@/components/contact-form';
import Brand from '@/components/icons/Brand';

export default function Page() {
  return (
    <div className="-ml-20 flex h-full w-full items-center justify-center gap-10">
      <div className="w-2xl">
        <ContactForm />
      </div>
      <div className="">
        <Brand />
      </div>
    </div>
  );
}
