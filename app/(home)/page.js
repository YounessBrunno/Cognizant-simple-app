import SummarizerForm from "@/features/summarizer/components/SummarizerForm";

export default function Home() {
  return (
    <div className="w-full flex-1 min-h-0 flex flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-mono text-black mb-8">
          Welcome to Cognizant App
        </h1>
      </div>
      <SummarizerForm />
    </div>
  );
}
