
import "./App.css"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from "react-use-clipboard";
import {useState} from "react";

import ReactPlayer from 'react-player';


const App = () => {
    const [textToCopy, setTextToCopy] = useState();
    const [videoUrl, setVideoUrl] = useState(null);
    const [isCopied, setCopied] = useClipboard(textToCopy, {
        successDuration:1000
    });

    //subscribe to thapa technical for more awesome videos


      const handleStopListening = async () => {
        try {
            await SpeechRecognition.stopListening();
            const sanitizedText = encodeURIComponent(transcript);
    
            const response = await fetch('http://localhost:8000/receive-data', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ text: sanitizedText }),
            });
    
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const responseData = await response.json();
            console.log('Full response:', responseData);
            
            // Set both text and video URL
            setTextToCopy(responseData.text_response);
            setVideoUrl(responseData.video_url);
            console.log(videoUrl)
    
        } catch (error) {
            console.error('Operation failed:', error);
        }
    };
    
    

    const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return null
    }

    return (
        <>
            <div className="container">
                <h2>Speech to Text Converter</h2>
                <br/>
                <p>A React hook that converts speech from the microphone to text and makes it available to your React
                    components.</p>

                <div className="main-content" onClick={() =>  setTextToCopy(transcript)}>
                    {transcript}
                </div>

                <div className="btn-style">

                    {/* <button onClick={setCopied}>
                        {isCopied ? 'Copied!' : 'Copy to clipboard'}
                    </button> */}
                    <button onClick={startListening}>Start Listening</button>
                    <button onClick={SpeechRecognition.stopListening}>Stop Listening</button>
                    <button 
                        onClick={handleStopListening}
                        // disabled={!isListening}
                    >
                            Stop Listening & Send
                    </button>

                    // Add in your return statement
                    {videoUrl && (
                        <div className="video-container">
                            <ReactPlayer 
                                url={videoUrl}
                                controls={true}
                                width="100%"
                                height="400px"
                            />
                        </div>
                    )}


                </div>

            </div>

        </>
    );
};

export default App;