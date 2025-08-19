from transformers import T5Tokenizer, T5ForConditionalGeneration
import torch

MODEL_NAME = "google/flan-t5-base"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

tokenizer = T5Tokenizer.from_pretrained(MODEL_NAME)
model = T5ForConditionalGeneration.from_pretrained(MODEL_NAME).to(DEVICE)

def summarize_text(text: str, max_length: int = 200) -> str:
    prompt = f"summarize: {text.strip()}"
    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=512).to(DEVICE)
    outputs = model.generate(**inputs, max_length=max_length, num_beams=4, early_stopping=True)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

def summarize_long_cluster(sentences, chunk_size=6):
    summaries = []
    for i in range(0, len(sentences), chunk_size):
        chunk = " ".join(sentences[i:i+chunk_size])
        if len(chunk.strip()) > 20:
            summaries.append(summarize_text(chunk))
    return " ".join(summaries)
