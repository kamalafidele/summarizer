import nltk

nltk.download('punkt')
# nltk.download('averaged_perceptron_tagger')
nltk.download('maxent_ne_chunker')
nltk.download('words')

def extract_named_entities(text):
    # Tokenize the text
    words = nltk.word_tokenize(text)
    
    # Part of Speech tagging
    words_with_pos = nltk.pos_tag(words)
    
    # Named Entity Recognition
    named_entities = nltk.ne_chunk(words_with_pos)
    
    # Extract and print named entities
    return named_entities

text = "Apple Inc. is planning to open a new store in San Francisco."
print(extract_named_entities(text))