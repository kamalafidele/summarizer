import json
import quart
import quart_cors
from quart import request

from entity_recognization import extract_entity
from summarize import summarize_text

app = quart_cors.cors(quart.Quart(__name__), allow_origin="https://chat.openai.com")


@app.post("/summarize")
async def summarize():
    request = await quart.request.get_json(force=True)
    text = request["text"]

    summary = summarize_text(text)
    # entities = extract_entity(summary)
    # data = { "recognized_entities": entities, "extracted_summary": summary }
    data = { "extracted_summary": summary }

    return quart.Response(response=json.dumps(data, indent=4), status=200)


@app.get("/logo.jpg")
async def plugin_logo():
    filename = 'logo.jpg'
    return await quart.send_file(filename, mimetype='image/jpg')

@app.get("/.well-known/ai-plugin.json")
async def plugin_manifest():
    host = request.headers['Host']
    with open("./.well-known/ai-plugin.json") as f:
        text = f.read()
        return quart.Response(text, mimetype="text/json")

@app.get("/openapi.yaml")
async def openapi_spec():
    host = request.headers['Host']
    with open("openapi.yaml") as f:
        text = f.read()
        return quart.Response(text, mimetype="text/yaml")

def main():
    app.run(debug=True, host="0.0.0.0", port=7500)

if __name__ == "__main__":
    main()
