from fastapi import FastAPI

app = FastAPI()

@app.get("/get-transcript")
def get_transcript():
    return {
        "status": "success",
        "raw_text": "Hello welcome to live news"
    }