from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.stem import PorterStemmer
from nltk.probability import FreqDist
from heapq import nlargest
import nltk

nltk.download('stopwords')
nltk.download('punkt')

def summarize_text(text, num_sentences=5):
    # Tokenize the text into sentences
    sentences = sent_tokenize(text)
    
    # Tokenize the text into words
    words = word_tokenize(text)
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    words = [word for word in words if word.casefold() not in stop_words]
    
    # Apply stemming
    stemmer = PorterStemmer()
    stemmed_words = [stemmer.stem(word) for word in words]
    
    # Calculate word frequency
    freq_dist = FreqDist(stemmed_words)
    
    # Assign scores to sentences based on word frequency
    sentence_scores = {}
    for i, sentence in enumerate(sentences):
        for word in word_tokenize(sentence):
            stemmed_word = stemmer.stem(word)
            if stemmed_word in freq_dist:
                if i in sentence_scores:
                    sentence_scores[i] += freq_dist[stemmed_word]
                else:
                    sentence_scores[i] = freq_dist[stemmed_word]
    
    # Select the top N sentences with highest scores
    top_sentences = nlargest(num_sentences, sentence_scores, key=sentence_scores.get)
    
    # Reconstruct the summarized text
    summary = [sentences[i] for i in sorted(top_sentences)]
    
    return ' '.join(summary)