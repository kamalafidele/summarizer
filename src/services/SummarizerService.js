const { OpenAI } = require("langchain/llms/openai");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { loadSummarizationChain } = require("langchain/chains");
const winkNLP = require("wink-nlp");
const { OpenAIApi, Configuration } = require('openai');
const dotenv = require('dotenv');
dotenv.config();


const model = require("wink-eng-lite-web-model");

const { OPEN_AI_KEY } = process.env;

const configuration = new Configuration({
  apiKey: OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

class SummarizerService {
  static async summarizeWithLangchain(script) {
    const model = new OpenAI({
      openAIApiKey: OPEN_AI_KEY,
      temperature: 1,
      modelName: "text-davinci-003",
      maxTokens: 100,
    });

    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });

    const docs = await splitter.createDocuments([script]);
    const chain = loadSummarizationChain(model, { type: "map_reduce" });

    const { text: summarizedText } = await chain.call({
      input_documents: docs,
    });

    return summarizedText;
  }

  static async summarizeWithApi(script) {
    const prompt = `Summarize this tv script:${script}`;
    const res = await openai.createCompletion({ model: 'text-davinci-003', prompt, temperature: 1, max_tokens: 100 });

    const { text } = res.data.choices[0];
    return text.trim();
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
    
    return extracted_entities;
  }

  static async extractEntitiesWithAPI(summary) {
    const prompt = `Extract entities in this text and return them in a python list:${summary}`;
    const res = await openai.createCompletion({ model: 'text-davinci-003', prompt, temperature: 0, max_tokens: 50 });

    const { text } = res.data.choices[0];
    const entities = text.trim()
    return entities;
  }
}

module.exports = SummarizerService;
