import { CopyIcon } from "lucide-react";

export default function SummaryResult({ summary, error }) {
  return (
    <div>   
     {summary && 
       (
           <div className="relative mt-4 p-4 bg-gray-100 rounded-lg border border-gray-300">
             <button className="absolute top-1.5 right-1.5 p-1.5 rounded-md cursor-pointer hover:bg-gray-200 transition">
               <CopyIcon 
                 className="w-5 h-5 text-gray-500 hover:text-gray-700"
                 strokeWidth={1.5}
                 onClick={() => navigator.clipboard.writeText(summary)}
               />
             </button>

             <h3 className="font-bold mb-2">Summary:</h3>
             <p className="text-gray-700">{summary}</p>
           </div>
     )}

     {error && (
           <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
             Error: {error}
           </div>
     )}
    </div>
  )
}
