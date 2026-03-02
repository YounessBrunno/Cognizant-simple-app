import Image from "next/image"
import logo from "public/assets/logos/CognizantLogo.svg"
import HistoryPanel from "@/features/summarizer/components/HistoryPanel"


function SummarizerSideBar() {
  return (
    <aside className="fixed top-0 left-0 bg-white flex flex-col items-center justify-start gap-2 w-58 py-2 pb-3 h-screen border-r overflow-y-auto">
      <Image src={logo} alt="Logo" width={170} height={170}  className="mb-10"/>
      <HistoryPanel />
    </aside>
  )
}

export default SummarizerSideBar