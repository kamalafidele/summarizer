const { OpenAI }  = require('langchain/llms/openai');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { loadSummarizationChain } = require('langchain/chains');

const { OPEN_AI_KEY } = process.env;

class SummarizerService {
    static async generateSummary(script) {
        const model = new OpenAI({ openAIApiKey: OPEN_AI_KEY, temperature: 0 });
        
        const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
        
        const docs = await splitter.createDocuments([script]);
        const chain = loadSummarizationChain(model, { type: "map_reduce" });
        
        const { text: summarizedText } = await chain.call({
            input_documents: docs,
        });
        
        return summarizedText;
    }
}

module.exports = SummarizerService;
