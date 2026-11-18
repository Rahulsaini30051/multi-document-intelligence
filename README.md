# Multi-Document Intelligence Workbench

A full-stack AI-powered application that allows users to upload multiple documents, extract their content, and generate structured comparisons, insights, risks, and missing information using OpenAI.

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express.js, TypeScript
- Database: SQLite
- ORM: Prisma
- AI: OpenAI API
- Document Processing: PDF, TXT and CSV extraction

## Project Structure

```text
multi-document-intelligence/
├── client/
├── server/
│   ├── prisma/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   └── .env.example
└── README.md
```

## Prerequisites

- Node.js 22+
- npm
- OpenAI API key with available API credits

## Installation and Setup

### 1. Clone Repository

```bash
git clone https://github.com/Rahulsaini30051/multi-document-intelligence.git
cd multi-document-intelligence
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `server` directory.

```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="your_openai_api_key"
```

Replace the placeholder with a valid OpenAI API key.

### 5. Generate Prisma Client and Run Database Migration

From the `server` directory:

```bash
npx prisma generate
npx prisma migrate deploy
```

### 6. Start Backend

```bash
npm run dev
```

Backend runs at:

`http://localhost:5000`

### 7. Start Frontend

From the `client` directory:

```bash
npm run dev
```

Open the Vite URL shown in your terminal, usually:

`http://localhost:5173`

## Application Workflow

1. Upload multiple PDF, TXT or CSV documents.
2. Extract and process document content.
3. Select documents for analysis.
4. Enter a natural-language analysis instruction.
5. Generate AI-powered summaries and comparisons.
6. Review findings, risks, missing information and supporting evidence.
7. Copy the analysis results.

## Security

- API keys are stored in backend environment variables.
- Environment files are excluded from Git.
- Uploaded documents and local database files are excluded from Git.

## Repository

https://github.com/Rahulsaini30051/multi-document-intelligence