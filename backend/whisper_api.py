from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
# import whisper
import os
import numpy as np
from faster_whisper import WhisperModel

from fastapi import Request
from embedding_utils import segment_and_embed
from clustering_utils import cluster_embeddings
from summary_utils import summarize_text
from summary_utils import summarize_long_cluster
from embedding_utils import is_meaningful_cluster

import torch
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load Whisper Model
# model = whisper.load_model("medium").to(device)
# model = whisper.load_model("base").to(device)
model = WhisperModel("medium", device="cuda" if torch.cuda.is_available() else "cpu", compute_type="float16" if torch.cuda.is_available() else "int8")


app = FastAPI()

# CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/api/transcribe/")
async def transcribe(file: UploadFile = File(...)):
    filename = f"temp_{file.filename}"
    with open(filename, "wb") as f:
        f.write(await file.read())

    segments, _info = model.transcribe(
        filename,
        beam_size=1,  # 可选：1 为 greedy，速度最快
        language="en"
    )

    # 拼接所有段落文本
    full_text = " ".join([segment.text for segment in segments])

    os.remove(filename)

    return {
        "text": full_text
    }

@app.post("/api/summarize/")
async def summarize(request: Request):
    data = await request.json()
    text = data.get("text", "")
    if not text:
        return {"clusters": []}

    segments = segment_and_embed(text)
    embeddings = [seg["embedding"] for seg in segments]
    # cluster_map = cluster_embeddings(np.array(embeddings))
    cluster_map = cluster_embeddings(np.array(embeddings), eps=0.6, min_samples=3)
    print("Count of sentences:", len(segments))
    print("Count of Cluster:", len(cluster_map))
    
    clustered_segments = []

    for cluster_id, indices in cluster_map.items():
        cluster_sentences = [segments[i]["sentence"] for i in indices]

        cluster_type = "main" if is_meaningful_cluster(cluster_sentences) else "weak"
        cluster_summary = summarize_long_cluster(cluster_sentences)

        cluster_obj = {
            "label": int(cluster_id),
            "summary": cluster_summary,
            "segments": cluster_sentences,
            "type": cluster_type
        }

        if len(cluster_sentences) >= 15:
            subclusters = []
            chunk_size = 8
            for i in range(0, len(cluster_sentences), chunk_size):
                subclusters.append({
                    "label": i // chunk_size,
                    "segments": cluster_sentences[i:i + chunk_size]
                })
            cluster_obj["subclusters"] = subclusters

        clustered_segments.append(cluster_obj)


    overall_summary = " ".join([cluster["summary"] for cluster in clustered_segments])

    return {
        "summary": overall_summary,
        "clusters": clustered_segments
    }

