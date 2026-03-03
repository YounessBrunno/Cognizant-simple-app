import SummarizerSideBar from "./SummarizerSideBar";

export default function SummarizerLayout({ children }) {
  return (
    <>
      <SummarizerSideBar />
      <main className="min-h-screen bg-gray-50 flex flex-col items-stretch justify-start pl-58 gap-4 p-4">
        {children}
      </main>
    </>
  );
}
