import HistoryDetail from "@/features/summarizer/components/HistoryDetail";

export default async function HistoryDetailPage({ params }) {
  const { id } = await params;

  return <HistoryDetail id={id} />;
}