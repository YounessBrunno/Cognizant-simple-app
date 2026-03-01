

export default function SummaryResult({ summary, error }) {
  return (
    <div>   
     {summary && 
       (
           <div className="mt-4 p-4 bg-gray-100 rounded-lg">
             <h3 className="font-bold mb-2">Summary:</h3>
             <p className="text-gray-700">{summary}</p>
           </div>
     )}

     {error && (
           <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
             Error: {error}
           </div>
     )}
    </div>
  )
}
