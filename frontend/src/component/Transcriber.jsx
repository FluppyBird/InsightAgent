import React, { useState } from "react";

export default function Transcriber() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  // const [segments, setSegments] = useState([]);  // 👈 
  const [clusters, setClusters] = useState([]);
  const [summary, setSummary] = useState("");


  const handleUpload = async () => {
    if (!file) return alert("Please choose an audio file");
    setLoading(true);
    setText("");
    setClusters([]);
    setSummary("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/api/transcribe/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setText(data.text || "");
    } catch (err) {
      console.error(err);
      alert("转录失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!text) return alert("请先转录文本");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/summarize/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      setClusters(data.clusters || []);
      setSummary(data.summary || "");
    } catch (err) {
      console.error(err);
      alert("总结失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto bg-white border-2 border-black rounded-lg p-6">
      <h2 className="text-lg font-bold mb-4">Upload Audio or Video Files</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Upload File</label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full border border-gray-300 rounded p-2"
        />
        {file && <p className="mt-2 text-sm text-gray-500">{file.name}</p>}
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`px-6 py-2 text-white font-semibold rounded transition ${
          loading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800"
        }`}
      >
        {loading ? "Transcribing..." : "Transcribe"}
      </button>

      {text && (
        <div className="mt-8 w-[95%] mx-auto">
          <h3 className="text-base font-semibold text-gray-700 mb-2">Transcription</h3>
          <div className="max-h-96 overflow-y-auto bg-gray-100 p-4 rounded border text-sm text-gray-800 whitespace-pre-wrap shadow-inner">
            {text}
          </div>

          <div className="text-center mt-4">
            <button
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
              onClick={handleSummarize}
            >
              Summarize
            </button>
          </div>
        </div>
      )}

      {clusters.length > 0 && (
        <div className="mt-8 w-[95%] mx-auto">
          <h3 className="text-base font-semibold text-gray-700 mb-2">Semantic Clusters</h3>
          <div className="space-y-4">

            {/* {clusters.map((cluster) => (
              <div key={cluster.label} className="p-4 border rounded shadow bg-white space-y-3">
                <h4 className="text-xl font-bold text-blue-700">Cluster {cluster.label}</h4>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded text-gray-800 text-sm italic">
                  {cluster.summary}
                </div>

                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  {cluster.segments.map((sentence, idx) => (
                    <li key={idx}>{sentence}</li>
                  ))}
                </ul>
              </div>
            ))} */}


            {clusters.map((cluster) => {
              const isWeak = cluster.type === "weak";
              return (
                <div
                  key={cluster.label}
                  className={`p-4 border rounded shadow space-y-3 ${
                    isWeak ? "bg-gray-100 border-gray-300 opacity-70" : "bg-white"
                  }`}
                >
                  <h4
                    className={`text-xl font-bold ${
                      isWeak ? "text-gray-500" : "text-blue-700"
                    }`}
                  >
                    Cluster {cluster.label} {isWeak && "(Weak)"}
                  </h4>

                  

                  {/* ✅ 如果存在子聚类 subclusters，就分段显示 */}
                  {cluster.subclusters ? (
                    cluster.subclusters.map((sub) => (
                      <div
                        key={sub.label}
                        className="bg-gray-50 border rounded p-3 mt-2 space-y-1"
                      >
                        <h5 className="text-sm font-semibold text-gray-500 mb-1">
                          Subgroup {sub.label}
                        </h5>
                        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                          {sub.segments.map((sentence, idx) => (
                            <li key={idx}>{sentence}</li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      {cluster.segments.map((sentence, idx) => (
                        <li key={idx}>{sentence}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}



            
          </div>
        </div>
      )}

      {summary && (
        <div className="mt-8 w-[95%] mx-auto">
          <h3 className="text-base font-semibold text-gray-700 mb-2">Summary</h3>
          <div className="bg-yellow-50 p-4 rounded border text-sm text-gray-800 whitespace-pre-wrap shadow-inner">
            {summary}
          </div>
        </div>
      )}

    </div>
  );
}
