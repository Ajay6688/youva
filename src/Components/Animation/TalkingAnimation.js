import "./Animation.css";
import { useEffect, useRef, useState } from "react";
import animationVideo from "../../Video/youvaAnimation.mp4";
import dancingVideo from "../../Video/Youva Dancing.mp4";
import thinkingVideo from "../../Video/Youva Thinking.mp4";
import smileVideo from "../../Video/youva smile.mp4";
import confusionVideo from "../../Video/youva confusion.mp4";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import PostAPI from "../../utils/PostApi";
import employee_data from "./data";
import userIconCircle from "../../Video/userIconCircle.svg";
import youvaIcon from "../../Video/youvaIcon.svg";
import listeningGif from "../../Video/listeningLoader.gif";
import loadingGif from "../../Video/Loading.gif"

function TalkingAnimation() {
  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const [isTalking, setIsTalking] = useState(true);
  const [listen, setListen] = useState(true);
  const [animation, setAnimation] = useState(dancingVideo);
  const [hist, setHist] = useState("");
  const [text, setText] = useState(transcript);
  const [loading, setLoading] = useState(false);
  const [isImagesLoaded , setIsImagesLoaded] = useState(false);
  const videoRef = useRef(null);
  const speechRef = useRef(null);
  const recognition = useRef(null);
  const [inputText, setInputText] = useState("Your input will be shown here");
  const [outputText, setOutputText] = useState(
    "Youva output will be shown here"
  );
  

  var voices = window.speechSynthesis.getVoices();

  const speakText = async (textToSpeak) => {
    setOutputText(() => textToSpeak);

    setIsTalking(true);
    setListen((prevState) => !prevState);
    setAnimation(animationVideo);

    const speech = new SpeechSynthesisUtterance(textToSpeak);

    // console.log(voices);
    const maleVoice = voices.find(
      (voice) =>
        voice.name ===
        "Microsoft Neerja Online (Natural) - English (India) (Preview)"
    );

    // const maleVoice = voices.find((voice) => voice.name === "Google हिन्दी");

    speech.voice = maleVoice;

    speech.pitch = 2;
    speech.rate = 1.2;

    console.log("text to speak ", textToSpeak);
    console.log(listen);
    // if(listen===false)
    // {
    console.log("inside", textToSpeak);
    videoRef.current.play();

    speechRef.current = speech;
    speechRef.current.onend = () => {
      videoRef.current.pause();
      setIsTalking(false);
      setListen((prevState) => !prevState);
      resetTranscript(() => "");
    };
    window.speechSynthesis.speak(speechRef.current);
    // Add event listeners for SpeechSynthesisUtterance events

    // }
  };

  const shutdown = () => {
    setIsTalking(true);
    videoRef.current.pause();
    setListen((prev) => !prev);
    setTimeout(() => {
      setAnimation(dancingVideo);
    }, 3000);
    setAnimation(smileVideo);
    setInputText(() => transcript);
    speakText("Pleasure to meet you. Bye!");
    localStorage.setItem("isShutDown", true);
    localStorage.setItem("reinitialize", true);
    window.dispatchEvent(new Event("storage"));
  };

  const sendResponseToChatGpt = async () => {
    setIsTalking(true)
    setLoading(true);
    setAnimation(thinkingVideo);
    setInputText((prev) => transcript);

    const response = await PostAPI({ text: transcript, hist: hist });
    console.log(response.chat_history);
    setHist(response.chat_history);
    setText(response.youva_response);
    setLoading(false);
    console.log(response);
    await speakText(response.youva_response);
    videoRef.current.play();
  };

  const firstPostApiCall = async () => {
    let currentUser = localStorage.getItem("current-user");
    // let firstRequest = ` Here is ${currentUser}. Please engage him in a friendly banter. You can tease him sometimes. Be the most charming host`; 

    const response = await PostAPI({
      text: employee_data[currentUser],
      hist: "",
    });
    setText(response.youva_response);
    setHist(response.chat_history);
    await SpeechRecognition.startListening();
  };

  useEffect(() => {

    window.addEventListener("storage", async () => {

      voices = window.speechSynthesis.getVoices();

      let imageLoaded = localStorage.getItem("IMAGES_LOADED");
      let shutDownState = localStorage.getItem("isShutDown");
      let user = localStorage.getItem("current-user");
      let initializeYouva = localStorage.getItem("INITIALIZE_YOUVA");

      if (
        imageLoaded &&
        imageLoaded == "true" &&
        user &&
        initializeYouva &&
        initializeYouva == "true"
      ) {
        setIsImagesLoaded(true);
        console.log("imageLoaded ", imageLoaded);
        console.log("user ", user);
        console.log("initializeYouva ", initializeYouva);
        localStorage.setItem("INITIALIZE_YOUVA", false);
        await firstPostApiCall();
        console.log("after first post api call");
        if(user === "unknown"){
          speakText(`Hello! It's great to see you here today.`);
        }else{
          speakText(`Hello! ${user} It's great to see you here today.`);
        }
          console.log(isTalking)
          setIsTalking(false) ;
      }

      console.log("upisde if");
      console.log("imageLoaded ", imageLoaded);
      console.log("user ", user);
      console.log("initializeYouva ", initializeYouva);
        imageLoaded = localStorage.getItem("IMAGES_LOADED");
        user = localStorage.getItem("current-user");
        initializeYouva = localStorage.getItem("INITIALIZE_YOUVA");
        shutDownState = localStorage.getItem("isShutDown");
        let reinitialize = localStorage.getItem("reinitialize");
        console.log("inside setTimeout");
        console.log("imageLoaded ", imageLoaded);
        console.log("user ", user);
        console.log("initializeYouva ", initializeYouva);
        if (
          imageLoaded &&
          imageLoaded == "true" &&
          user &&
          initializeYouva &&
          initializeYouva == "false" &&
          shutDownState &&
          shutDownState == "false" &&
          reinitialize &&
          reinitialize == "true"
        ) {

          if(user==="unknown"){
            speakText(`Hello! It's great to see you here today.`);
          }
          else{
            speakText(`Hello! ${user} It's great to see you here today.`);
          }
  
          localStorage.setItem("reinitialize", false);
          setListen((prev) => !prev);
          setIsTalking(false);
        }
    });
  }, []);

  const startListen = async () => {
    if (listen === true) {
      await SpeechRecognition.startListening();
    }
  };

  useEffect(() => {
    startListen();
  });

  //console.log("component re-renders");
  useEffect(() => {
    if (
      transcript.toLocaleLowerCase().includes("bye") ||
      transcript.toLocaleLowerCase().includes("shut down") ||
      transcript.toLocaleLowerCase().includes("shutdown") ||
      transcript.toLocaleLowerCase().includes("bye bye") ||
      transcript.toLocaleLowerCase().includes("by by")
    ) {
      shutdown();
      return;
    }

    if (!listening) {

      if ( transcript === "" ||transcript === null || transcript === undefined || isTalking === true ) {
        return;
      }
      if (localStorage.getItem("IMAGES_LOADED") === false) {
        return;
      }
      sendResponseToChatGpt();
      return;
    }
  }, [listening , isTalking]);

  return (
    <div className="mainContainer">
      <div className="leftContainer">
        <video
          className="animationVideo"
          src={animation}
          ref={videoRef}
          autoPlay={true}
          muted
          loop
        />

        {loading && <img className="loadingGif" src={loadingGif} alt="loading"/>}
        {loading && <p style={{marginLeft: "9px", marginTop: "-7px" , fontSize : "27px" ,fontWeight : "450"}}>Loading ...</p>}
        {!isTalking && <img className="loadingGif" src={listeningGif} alt="listening"/>}
        {!isTalking && <p style={{marginLeft: "9px", marginTop: "-7px" , fontSize : "27px" , fontWeight : "450"}}>Listening ...</p>}
        {!isImagesLoaded && <p>initializing Youva...</p>}
      </div>
      <div className="rightContainer">
        <div>
          <div className="outputContainer">
            <div className="helloContainer">
              <p className="helloText">{inputText}</p>
            </div>
            <img className="iconImage" src={userIconCircle} alt="user circle" />
          </div>
          <div className="outputContainer2">
            <img className="youvaIconImage" src={youvaIcon} alt="user circle" />
            <div className="responseContainer">
              <p className="helloText">{outputText}</p>
            </div>
          </div>
        </div>
        <div className="shutdownContainer">
        <p className="shutDownMessage">To end the conversation, say "Bye Bye"</p>
        </div>
      </div>
    </div>
  );
}

export default TalkingAnimation;
