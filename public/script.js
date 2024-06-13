Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
]).then(start);
let video;
let labeledFaceDescriptors;
let faceMatcher;
let videoEl;
const distanceThreshold = 0.6;
async function start() {
  console.log("Inside start");
  labeledFaceDescriptors = await loadLabeledImages();
  faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
  // document.body.append("Models are loaded!");

  // Get access to the camera
  try {
    video = await navigator.mediaDevices.getUserMedia({ video: true });
  } catch (e) {
    console.error("Failed to access the webcam", e);
    return;
  }

  // Create a video element and start playing the stream
  videoEl = document.createElement("video");
  videoEl.id = "new-video";
  videoEl.srcObject = video;
  videoEl.play();

  // Perform face recognition on each frame of the video
  const cron1 = setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(videoEl)
      .withFaceLandmarks()
      .withFaceDescriptors();
    const results = detections.map((d) =>
      faceMatcher.findBestMatch(d.descriptor)
    );

    results.forEach((result, i) => {
      if (result.distance < distanceThreshold) {
        localStorage.setItem("current-user", result.label);
        localStorage.setItem("isShutDown", false);
        localStorage.setItem("INITIALIZE_YOUVA", true);
        window.dispatchEvent(new Event("storage"));
        pause();
        clearInterval(cron1);
        // console.log(`Person: ${result.label}, Confidence: ${result.distance}`);
      } else {
        // console.log(
        //   `OTHER=> Person: ${result.label}, Confidence: ${result.distance}`
        // );
        // localStorage.setItem("current-user", "unknown");
        // localStorage.setItem("isShutDown", false);
        // localStorage.setItem("INITIALIZE_YOUVA", true);
        // window.dispatchEvent(new Event("storage"));
        // pause();
        // clearInterval(cron1);
      }
    });

    //   if (results.length > 0) {
    //     const result = results[0];
    //     if (result.distance < distanceThreshold) {
    //       localStorage.setItem("current-user", result.label);
    //       localStorage.setItem("isShutDown", false);
    //       window.dispatchEvent(new Event("storage"));
    //       pause();
    //       clearInterval(cron1);

    //       // console.log(`Person: ${result.label}, Confidence: ${result.distance}`);
    //     } else {
    //       // console.log(
    //       //   `OTHER=> Person: ${result.label}, Confidence: ${result.distance}`
    //       // );
    //       console.log("inside else setting unknown");
    //       localStorage.setItem("current-user", "unknown");
    //       localStorage.setItem("isShutDown", false);
    //       localStorage.setItem("INITIALIZE_YOUVA", true);
    //       window.dispatchEvent(new Event("storage"));
    //       pause();
    //       clearInterval(cron1);
    //     }
    //   } else {
    //     console.log("doesn't work");
    //   }
  }, 500);
}

// setInterval(function() {
//   // Get the value of "isShutdown" from local storage
//   // Check if "isShutdown" is set to true
//   console.log("inside func, isShutdown: ", localStorage.getItem("isShutDown"))
//   if (localStorage.getItem("isShutDown") === "true") {
//     console.log("isShutdown in script, it works");
//     // Perform some action if "isShutdown" is true
//     start();
//   }
// }, 3000); // Repeat the function every 3 seconds (3000 milliseconds)

window.addEventListener("storage", async () => {
  const shutDownState = localStorage.getItem("isShutDown");
  if (shutDownState == "true") {
    await resume();
  }
});

async function pause() {
  if (video) {
    video.getTracks().forEach((track) => track.stop());
  }
}
async function loadLabeledImages() {
  let inCorrectImages = [];
  const labels = [
    "Abhi H",
    // "Abhishek B",
    // "Affan",
    "Ajay",
    "Ajit",
    "Amaresh",
    // "Avinash",
    // "Bhanu",
    // "Bhuvana",
    "Brajendra",
    // "C  Vinay",
    // "Chandhana",
    // "Devendar",
    // "Faiz",
    // "Hrithik",
    // "Jyothi",
    // "KK",
    "Madhumita",
    // "Mubashir",
    // "Narasimha K",
    //"Omana", rename
    // "Peresh",
    // "Pradeep",
    // "Prakash",
    "Priyanka",
    // "Promit",
    // "Raja ram",
    // "Rajasree",
    // "Rizwan",
    // "Rohith",
    // "Sai Rajeswar",
    // "Saleem",
    // "Sandesh",
    // "Satish P",
    // "Shobhit",
    "Sireesha",
    // "Siva Krishna",
    // "Siva Sai",
    "Sohini",
    // "Sowjanya",
    // "Sravan",
    // "Sridhar",
    // "Suneetha",
    // "Sunny",
    "Sushant",
    // "Swathi",
    "Uma",
    // "Vijay K",
    // "Vinodh",
    "Vipul",
    // "Yaseen",
    // "Yashwanth",
  ];
  const labelsDemo = ["Amaresh", "Ajay", "Madhumita", "Siva Sai", "Vipul"];
  // const fs = require("fs");

  // // Path to the directory containing the folders you want to use as labels
  // const directoryPath = "/labeled_images";

  // // Get the names of the folders inside the directory
  // const labels = fs.readdirSync(directoryPath);
  try {
    const descriptions = [];

    for (const label of labels) {
      console.log(label);
      const labelDescriptions = [];

      for (let i = 1; i <= 15; i++) {
        try {
          const img = await loadImageFromFile(
            `./labeled_images/Employee- Youva -Photos/${label}/${i}.jpg`
          );
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          if (detections) {
            labelDescriptions.push(detections.descriptor);
          } else {
            console.log(`No face detected in ${label}/${i}.jpg`);
            inCorrectImages.push(label);
          }
        } catch (error) {
          break;
        }
      }

      descriptions.push(
        new faceapi.LabeledFaceDescriptors(label, labelDescriptions)
      );
    }
    console.log("Loading of images done!");
    localStorage.setItem("IMAGES_LOADED", true);
    window.dispatchEvent(new Event("storage"));
    console.log(inCorrectImages);
    return descriptions;
  } catch (err) {
    console.log(err);
  }
}

async function loadImageFromFile(path) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = path;
  });
}

async function resume() {
  try {
    video = await navigator.mediaDevices.getUserMedia({ video: true });
  } catch (e) {
    console.error("Failed to access the webcam", e);
    return;
  }
  videoEl.id = "new-video";
  videoEl.srcObject = video;
  videoEl.play();
  const cron2 = setInterval(async () => {
    console.log("!@#");

    const detections = await faceapi
      .detectAllFaces(videoEl)
      .withFaceLandmarks()
      .withFaceDescriptors();
    const results = detections.map((d) =>
      faceMatcher.findBestMatch(d.descriptor)
    );

    results.forEach((result, i) => {
      if (result.distance < distanceThreshold) {
        localStorage.setItem("current-user", result.label);
        localStorage.setItem("isShutDown", false);
        window.dispatchEvent(new Event("storage"));
        pause();
        clearInterval(cron2);

        // console.log(`Person: ${result.label}, Confidence: ${result.distance}`);
      } else {
        // console.log(
        //   `OTHER=> Person: ${result.label}, Confidence: ${result.distance}`
        // );
        // console.log("inside else setting unknown");
        // localStorage.setItem("current-user", "unknown");
        // localStorage.setItem("isShutDown", false);
        // localStorage.setItem("INITIALIZE_YOUVA", true);
        // window.dispatchEvent(new Event("storage"));
        // pause();
        // clearInterval(cron2);
      }
    });

    // if (results.length > 0) {
    //   const result = results[0];
    //   if (result.distance < distanceThreshold) {
    //     localStorage.setItem("current-user", result.label);
    //     localStorage.setItem("isShutDown", false);
    //     window.dispatchEvent(new Event("storage"));
    //     pause();
    //     clearInterval(cron2);

    //     // console.log(`Person: ${result.label}, Confidence: ${result.distance}`);
    //   } else {
    //     // console.log(
    //     //   `OTHER=> Person: ${result.label}, Confidence: ${result.distance}`
    //     // );
    //     console.log("inside else setting unknown");
    //     localStorage.setItem("current-user", "unknown");
    //     localStorage.setItem("isShutDown", false);
    //     localStorage.setItem("INITIALIZE_YOUVA", true);
    //     window.dispatchEvent(new Event("storage"));
    //     pause();
    //     clearInterval(cron2);
    //   }
    // } else {
    //   console.log("code doesn't work");
    // }
  }, 500);
}
