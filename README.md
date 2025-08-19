# 🧠 InsightAgent – Multi-Role Meeting Summary & Action Item Tracking System

InsightAgent is an AI-powered meeting assistant that automatically generates structured meeting summaries and action items from audio recordings.  
It supports conversation clustering, summary generation, task extraction, and multi-speaker role identification, making it useful for project meetings, team standups, technical reviews, and interview retrospectives.

---

## 🚧 Architecture Overview

User uploads audio (.mp3/.wav)
         ↓
Audio transcription → faster-whisper
         ↓
Sentence segmentation + embedding (SentenceTransformer MiniLM/BGE)
         ↓
DBSCAN semantic clustering
         ↓
Filter out empty clusters
         ↓
GPT-5 → summary + action item extraction + topic (optional)
         ↓
Frontend displays structured summary cards

---

## ⚙️ Tech Stack

| Stage                    | Tool / Technology                                             |
|--------------------------|--------------------------------------------------------------|
| Speech-to-Text           | faster-whisper                                               |
| Embedding                | sentence-transformers (MiniLM / BGE)                         |
| Semantic Clustering      | DBSCAN (Scikit-learn)                                        |
| Summarization / Extraction | GPT-5                                                     |
| Backend API              | FastAPI                                                      |
| Frontend                 | React + Vite                                                 |
| Deployment               | Local (npm+pip) **or** Docker                                |

---

## ✅ Local Development (Python + Node)

> Default ports:  
> Frontend → http://localhost:5173  
> Backend → http://localhost:8000

### 1. Clone the repo
```bash
git clone https://github.com/<yourUsername>/InsightAgent.git
cd InsightAgent
```

### 2. Start the backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

### 3. Start the frontend
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🐳 Docker Deployment

### 1. Build & run using Docker Compose  
```bash
docker compose up -d --build
```

### 2. Access the application  
- Frontend → http://localhost:5173  
- API → http://localhost:8000

> ✅ Dockerfile and docker-compose.yml are already included in the repository.

---

## 🧪 Example Usage

1. Open the Web UI → **Upload Audio File**
2. Click **Transcribe**
3. View clustered conversation blocks + summaries and action items in the result page

---

## 📌 TODO / Roadmap

- [ ] Multi-language support (EN/中文)
- [ ] Slack / Teams webhook integration
- [ ] Support for speaker diarization using voice embeddings
- [ ] Export summary to Markdown / PDF

---

## 📄 License

MIT License
