from sklearn.cluster import DBSCAN
import numpy as np

def cluster_embeddings(embeddings, eps=0.5, min_samples=2, metric="cosine"):
    clustering = DBSCAN(eps=eps, min_samples=min_samples, metric="cosine")
    labels = clustering.fit_predict(embeddings)

    clusters = {}
    for idx, label in enumerate(labels):
        if label == -1:
            continue
        clusters.setdefault(label, []).append(idx)

    return clusters
