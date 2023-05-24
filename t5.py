from transformers import T5Tokenizer, T5ForConditionalGeneration
from sample_texts import text2
from entity_recognization import extract_entity

def abstractive_summarization(text):
    # Load the T5 model and tokenizer
    model_name = "t5-base"
    tokenizer = T5Tokenizer.from_pretrained(model_name)
    model = T5ForConditionalGeneration.from_pretrained(model_name)

    # Preprocess the input text
    inputs = tokenizer.encode("summarize: " + text, return_tensors="pt", max_length=512, truncation=True)

    # Generate the summary
    summary_ids = model.generate(inputs, max_length=150, num_beams=4, early_stopping=True)
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    return summary

# Example usage

summary = abstractive_summarization(text2)
entities = extract_entity(summary)

