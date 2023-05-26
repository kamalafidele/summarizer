import spacy
from pathlib import Path


def extract_entity():
    path = Path('./summary.txt')
    text = path.read_text()

    # Load the pre-trained SpaCy model
    nlp = spacy.load("en_core_web_sm")

    # Process the text with SpaCy
    doc = nlp(text)
    entities = []
    # Extract named entities
    for entity in doc.ents:
        entities.append(entity.text)

    return sorted(set(entities))

print(extract_entity())