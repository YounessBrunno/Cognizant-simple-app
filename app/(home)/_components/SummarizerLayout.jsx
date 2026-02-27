import SummarizerSideBar from "./SummarizerSideBar";

export default function SummarizerLayout({ children }) {
  return (
    <>
      <SummarizerSideBar />
      <main>
        {children}
      </main>
    </>
  )
}
