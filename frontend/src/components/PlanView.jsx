import { useState } from "react";

export default function PlanView({ plan }) {
  const [pdfReady, setPdfReady] = useState(false);

  // Convert plan object → readable text
  const planText = Object.entries(plan)
    .map(([time, activity]) => `${time} - ${activity}`)
    .join("\n");

  const generatePDF = async () => {
    const res = await fetch("http://localhost:5000/finalize-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ plan: planText })
    });

    if (res.ok) {
      setPdfReady(true);
    }
  };

  return (
    <div className="mt-6 p-4 rounded-xl bg-white/10 text-white">
      <h3 className="text-lg font-semibold mb-3">📅 Your Final Plan</h3>

      {/* Plan Display */}
      <pre className="whitespace-pre-wrap text-sm">
        {planText}
      </pre>

      {/* Generate PDF Button */}
      <button
        onClick={generatePDF}
        className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
      >
        📄 Generate Final Plan PDF
      </button>

      {/* Download Button */}
      {pdfReady && (
        <a
          href="http://localhost:5000/static/pdfs/Final_Plan.pdf"
          download
          className="ml-4 text-blue-400 underline"
        >
          ⬇ Download PDF
        </a>
      )}
    </div>
  );
}
