-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "storedFilename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "filePath" TEXT NOT NULL,
    "extractedText" TEXT,
    "processingStatus" TEXT NOT NULL DEFAULT 'UPLOADED',
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "prompt" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "result" TEXT,
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AnalysisDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "analysisId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    CONSTRAINT "AnalysisDocument_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AnalysisDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Finding" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "analysisId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "interpretation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Finding_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FindingEvidence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "findingId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "evidenceText" TEXT NOT NULL,
    "fieldName" TEXT,
    CONSTRAINT "FindingEvidence_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "Finding" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FindingEvidence_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Document_createdAt_idx" ON "Document"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AnalysisDocument_analysisId_documentId_key" ON "AnalysisDocument"("analysisId", "documentId");

-- CreateIndex
CREATE INDEX "Finding_analysisId_idx" ON "Finding"("analysisId");

-- CreateIndex
CREATE INDEX "FindingEvidence_findingId_idx" ON "FindingEvidence"("findingId");

-- CreateIndex
CREATE INDEX "FindingEvidence_documentId_idx" ON "FindingEvidence"("documentId");
