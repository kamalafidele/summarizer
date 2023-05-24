import spacy


def extract_entity(text):
    # Load the pre-trained SpaCy model
    nlp = spacy.load("en_core_web_lg")

    # Process the text with SpaCy
    doc = nlp(text)
    entities = []
    # Extract named entities
    for entity in doc.ents:
        entities.append(entity.text)

    return sorted(set(entities))