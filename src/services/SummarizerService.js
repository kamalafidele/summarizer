const { OpenAI } = require("langchain/llms/openai");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { loadSummarizationChain } = require("langchain/chains");
const winkNLP = require("wink-nlp");

// Load english language model.
const model = require("wink-eng-lite-web-model");

const { OPEN_AI_KEY } = process.env;

class SummarizerService {
  static async generateSummary(script) {
    const model = new OpenAI({
      openAIApiKey: OPEN_AI_KEY,
      temperature: 0,
      modelName: "gpt-3.5-turbo",
    });

    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });

    const docs = await splitter.createDocuments([script]);
    const chain = loadSummarizationChain(model, { type: "map_reduce" });

    const { text: summarizedText } = await chain.call({
      input_documents: docs,
    });

    return summarizedText;
  }

  static extractEntities(summary) {
    // Instantiate winkNLP & Obtain "its" helper to extract item properties.
    const nlp = winkNLP(model);
    const its = nlp.its;

    // NLP Code.
    const doc = nlp.readDoc(summary);
    const entities = [];
    const extracted_entities = doc.entities().out(its.detail)
    extracted_entities.forEach((entity) => entities.push(entity.value));

    return entities;
  }
}

module.exports = SummarizerService;
