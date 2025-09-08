export default function Page() {
  return (
    <div className="mx-auto -mt-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center">
      <div className="flex flex-col gap-8">
        <h1 className="text-center text-5xl font-semibold">Fine Tune</h1>
        <h4 className="text-center text-2xl font-semibold">
          Model Fine Tuning as a Service
        </h4>
        <div>
          <p>
            We offer model fine-tuning as a service, enabling you to train
            powerful open source large
          </p>
          <p>
            language models on your proprietary data for dramatically improved
            performance tailored to
          </p>
          <p>
            your specific use case. Our platform helps you build domain specific
            models that understand
          </p>
          <p>
            your workflows, language, and tone. You provide the data, and we
            handle everything else, from
          </p>
          <p>
            the preprocessing, training, optimization, and secure deployment on
            our private cloud.
          </p>
        </div>
      </div>
    </div>
  );
}
