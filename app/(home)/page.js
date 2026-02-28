import SummarizerForm from "@/features/summarizer/components/SummarizerForm";
export default function Home() {
  return (
    <>
      <h1 className="text-4xl font-bold">Welcome to the Summarizer App</h1>
      <p className="text-lg text-gray-600">Use the sidebar to navigate through the app.</p>
      <SummarizerForm />
    </>
  );
}
