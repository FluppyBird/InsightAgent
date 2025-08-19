# backend/embedding_utils.py

from sentence_transformers import SentenceTransformer
import nltk
from nltk.tokenize import sent_tokenize
import re

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

# load model
model = SentenceTransformer("all-MiniLM-L6-v2")

# filtering
FILLER_PATTERNS = [
    r"^(ah+|oh+|um+|uh+|yeah+|okay+|alright+|right+|hmm+|mm+|so+|well+|fine+|sorry+)[.!\s]*$",
    r"^([a-z\s]{1,10})[.!\s]*\1[.!\s]*$",
]

def is_filler(sentence: str):
    s = sentence.strip().lower()
    if len(s) < 10:
        return True
    for pattern in FILLER_PATTERNS:
        if re.fullmatch(pattern, s):
            return True
    return False

def segment_and_embed(text: str):
    """
    segment sentences, generate embedded vector
    format：
    [
        {"sentence": "...", "embedding": [0.123, ...]},
        ...
    ]
    """
    sentences = sent_tokenize(text)
    clean_sentences = [s for s in sentences if not is_filler(s)]
    embeddings = model.encode(clean_sentences, normalize_embeddings=True, show_progress_bar=False).tolist()
    return [
        {"sentence": s, "embedding": e}
        for s, e in zip(clean_sentences, embeddings)
    ]

def is_meaningful_cluster(segments: list[str]) -> bool:

    if len(segments) < 2:
        return False

    filler_keywords = [
        "thank you", "see you", "no kidding", "congratulations",
        "that's it", "welcome", "okay", "sounds good", "bye",
        "i'm not sure", "yes", "no", "yeah", "uh", "mm", "alright",
        "i'm surprised", "nice working with you"
    ]


    filler_hits = sum(
        1 for s in segments
        if any(k in s.lower() for k in filler_keywords)
    )

    ratio = filler_hits / len(segments)

    if len(segments) <= 4 and ratio >= 0.6:
        return False

    return True

