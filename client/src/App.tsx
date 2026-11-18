
import { useEffect, useState } from "react";

interface Document {
  id: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  processingStatus: string;
  createdAt: string;
}

interface Evidence {
  id: string;
  documentId: string;
  evidenceText: string;
  fieldName?: string;
}

interface Finding {
  id: string;
  type: string;
  severity: string;
  title: string;
  description: string;
  interpretation?: string;
  evidence: Evidence[];
}

interface Analysis {
  id: string;
  result: string;
  findings: Finding[];
}

const API_URL = "http://localhost:5000/api";

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [prompt, setPrompt] = useState(
    "Compare vendor pricing, delivery timelines, support coverage and hosting locations. Identify risks and missing information."
  );

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${API_URL}/documents`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load documents");
      }

      setDocuments(result.data || []);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to load documents"
      );
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const toggleDocument = (id: string) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setMessage("Please select documents first.");
      return;
    }

    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append("documents", file);
    });

    try {
      setUploading(true);
      setMessage("");

      const response = await fetch(`${API_URL}/documents/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Upload failed");
      }

      setMessage("Documents uploaded successfully!");
      setFiles(null);
      await fetchDocuments();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (selectedIds.length === 0) {
      setMessage("Please select at least one document.");
      return;
    }

    if (!prompt.trim()) {
      setMessage("Please enter an analysis instruction.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setAnalysis(null);

      const response = await fetch(`${API_URL}/analyses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          documentIds: selectedIds,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Analysis failed");
      }

      setAnalysis(result.data);
      setMessage("Analysis completed successfully!");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Analysis failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (size: number) =>
    `${(size / 1024).toFixed(2)} KB`;

  return (
    <main style={{
      maxWidth: "1100px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    }}>
      <h1>Multi-Document Intelligence Workbench</h1>

      <p>
        Upload documents, compare information and discover
        insights using AI.
      </p>

      <hr />

      <section>
        <h2>1. Upload Documents</h2>

        <input
          type="file"
          multiple
          accept=".pdf,.txt,.csv"
          onChange={(event) => setFiles(event.target.files)}
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          style={{ marginLeft: "10px" }}
        >
          {uploading ? "Uploading..." : "Upload Documents"}
        </button>
      </section>

      <hr />

      <section>
        <h2>2. Select Documents</h2>

        <p>Select documents you want GPT to analyze.</p>

        {documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "6px",
              }}
            >
              <label style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(doc.id)}
                  disabled={doc.processingStatus !== "COMPLETED"}
                  onChange={() => toggleDocument(doc.id)}
                />

                <span>
                  <strong>{doc.filename}</strong>
                  <br />
                  <small>
                    {doc.mimeType} | {formatSize(doc.fileSize)}
                    {" | "}
                    Status: {doc.processingStatus}
                  </small>
                </span>
              </label>
            </div>
          ))
        )}

        <p>Selected documents: {selectedIds.length}</p>
      </section>

      <hr />

      <section>
        <h2>3. Analysis Instructions</h2>

        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={5}
          style={{
            width: "100%",
            padding: "12px",
            boxSizing: "border-box",
          }}
          placeholder="Tell AI what you want to analyze..."
        />

        <button
          onClick={handleAnalyze}
          disabled={loading || selectedIds.length === 0}
          style={{
            marginTop: "15px",
            padding: "12px 24px",
            cursor: "pointer",
          }}
        >
          {loading ? "Analyzing documents..." : "Analyze Documents"}
        </button>
      </section>

      {message && (
        <p style={{ marginTop: "20px" }}>
          {message}
        </p>
      )}

      {loading && <p>GPT is analyzing your documents. Please wait...</p>}

      {analysis && (
        <section style={{ marginTop: "35px" }}>
          <hr />

          <h2>4. Analysis Results</h2>

          <h3>Overall Summary</h3>
          <p>{analysis.result}</p>

          <h3>Findings ({analysis.findings.length})</h3>

          {analysis.findings.map((finding) => (
            <article
              key={finding.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <h3>{finding.title}</h3>

              <p>
                <strong>Type:</strong> {finding.type}
                {" | "}
                <strong>Severity:</strong> {finding.severity}
              </p>

              <p>{finding.description}</p>

              {finding.interpretation && (
                <p>
                  <strong>Why it matters:</strong>{" "}
                  {finding.interpretation}
                </p>
              )}

              <h4>Supporting Evidence</h4>

              {finding.evidence.map((item) => {
                const source = documents.find(
                  (doc) => doc.id === item.documentId
                );

                return (
                  <div
                    key={item.id}
                    style={{
                      background: "#f5f5f5",
                      padding: "10px",
                      marginTop: "8px",
                    }}
                  >
                    <strong>{source?.filename || "Source document"}</strong>
                    <p>{item.fieldName}</p>
                    <blockquote>{item.evidenceText}</blockquote>
                  </div>
                );
              })}
            </article>
          ))}

          <button
            onClick={() =>
              navigator.clipboard.writeText(
                JSON.stringify(analysis, null, 2)
              )
            }
          >
            Copy Analysis JSON
          </button>
        </section>
      )}
    </main>
  );
}

export default App;
