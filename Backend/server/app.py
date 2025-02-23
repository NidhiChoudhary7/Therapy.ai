from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import ollama  # Make sure to install: pip install ollama
from video_generator import generate_video  
from fastapi import HTTPException

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

    
@app.post("/receive-data")
async def receive_data(request: Request):
    try:
        data = await request.json()
        print("Received data:", data)

        # Get Ollama response
        response = ollama.generate(
            model='mistral',
            prompt=data.get('text', '')
        )
        
        ollama_response = response['response']
        print("Ollama response:", ollama_response)

        # Generate video from Ollama response
        video_url = generate_video(ollama_response)  # Use your existing function
        
        return {
            "status": "success",
            "text_response": ollama_response,
            "video_url": video_url  # Add this to response
        }
        
    except Exception as e:
        print("Error processing request:", str(e))
        return {"status": "error", "detail": str(e)}

    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

