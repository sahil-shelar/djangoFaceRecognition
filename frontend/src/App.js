// App.js
import React, { useState, useRef } from 'react';
import './App.css';
import axios from 'axios'; // Import Axios
import SuccessPage from './SuccessPage'; // Import the SuccessPage component

function App() {
  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const nameInputRef = useRef(null);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const initWebcam = () => {
    stopWebcam();

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        setVideoStream(stream);
        videoRef.current.srcObject = stream;
      })
      .catch(handleWebcamError);
  };

  const handleWebcamError = (error) => {
    console.error('Error accessing webcam:', error.name, error.message);
    alert('Cannot access webcam. Please grant permission.');
  };

  const stopWebcam = () => {
    if (videoStream) {
      const tracks = videoStream.getTracks();
      tracks.forEach(track => track.stop());
      setVideoStream(null);
      videoRef.current.srcObject = null;
    }
  };

  const capture = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasRef.current.style.display = 'block';
    videoRef.current.style.display = 'none';
    stopWebcam();
  };

  const register = () => {
    const name = nameInputRef.current.value;
    const photo = dataURItoBlob(canvasRef.current.toDataURL());

    if (!name || !photo) {
      alert('Name and photo required');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('photo', photo, `${name}.jpg`);

    axios.post('http://localhost:8000/register/', formData)
      .then(response => {
        const data = response.data;
        if (data.success) {
          alert('Data successfully registered');
          window.location.href = '/';
        } else {
          alert('Failed');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const login = () => {
    const photo = dataURItoBlob(canvasRef.current.toDataURL());

    if (!photo) {
      alert('Photo required');
      return;
    }

    const formData = new FormData();    
    formData.append('photo', photo, 'login.jpg');

    axios.post('http://localhost:8000/login/', formData)
      .then(response => {
        const data = response.data;
        if (data.success) {
          alert('Login successful');
          setUserName(nameInputRef.current.value);
          setLoggedIn(true);
        } else {
          alert('Failed');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };


  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };


  const renderContent = () => {
    if (isLoggedIn) {
      // Render the SuccessPage component if logged in
      return <SuccessPage userName={userName} />;
    } else {
      // Render the login form if not logged in
      return (
        <div className = "container1">
          <h1>Face Recognition</h1> {/*change to Face Recognition*/}
          <div className='input'>
          <label htmlFor="name">Name :  </label>
          <span><input type="text" id="name" ref={nameInputRef} required /></span>
          <br />
          </div>
          <video id="video" width="520" height="400" autoPlay ref={videoRef}></video>
          <br />
          <canvas id="canvas" width="520" height="400" style={{ display: 'none' }} ref={canvasRef}></canvas>
          <br />
          <span><button onClick={initWebcam}>Start Webcam</button><button onClick={capture}>Capture Photo</button></span>
          <br />
          <span><button onClick={register}>Register</button><button onClick={login}>Login</button></span>
        </div>
      );
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
}

export default App;



// App.js
// import React, { useState, useRef } from 'react';
// import './App.css';
// import axios from 'axios'; // Import Axios
// import SuccessPage from './SuccessPage'; // Import the SuccessPage component

// function App() {
//   const [videoStream, setVideoStream] = useState(null);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const nameInputRef = useRef(null);
//   const [isLoggedIn, setLoggedIn] = useState(false);
//   const [userName, setUserName] = useState('');
//   const [currentPage, setCurrentPage] = useState(null);

//   const initWebcam = () => {
//     stopWebcam();

//     navigator.mediaDevices.getUserMedia({ video: true })
//       .then(stream => {
//         setVideoStream(stream);
//         videoRef.current.srcObject = stream;
//       })
//       .catch(handleWebcamError);
//   };

//   const handleWebcamError = (error) => {
//     console.error('Error accessing webcam:', error.name, error.message);
//     alert('Cannot access webcam. Please grant permission.');
//   };

//   const stopWebcam = () => {
//     if (videoStream) {
//       const tracks = videoStream.getTracks();
//       tracks.forEach(track => track.stop());
//       setVideoStream(null);
//       videoRef.current.srcObject = null;
//     }
//   };

//   const capture = () => {
//     const context = canvasRef.current.getContext('2d');
//     context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
//     canvasRef.current.style.display = 'block';
//     videoRef.current.style.display = 'none';
//     stopWebcam();
//   };

//   const register = () => {
//     const name = nameInputRef.current.value;
//     const photo = dataURItoBlob(canvasRef.current.toDataURL());

//     if (!name || !photo) {
//       alert('Name and photo required');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('photo', photo, `${name}.jpg`);

//     axios.post('http://localhost:8000/register/', formData)
//       .then(response => {
//         const data = response.data;
//         if (data.success) {
//           alert('Data successfully registered');
//           window.location.href = '/';
//         } else {
//           alert('Failed');
//         }
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });
//   };

//   const login = () => {
//     const photo = dataURItoBlob(canvasRef.current.toDataURL());

//     if (!photo) {
//       alert('Photo required');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('photo', photo, 'login.jpg');

//     axios.post('http://localhost:8000/login/', formData)
//       .then(response => {
//         const data = response.data;
//         if (data.success) {
//           alert('Login successful');
//           setUserName(nameInputRef.current.value);
//           setLoggedIn(true);
//         } else {
//           alert('Failed');
//         }
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });
//   };


//   const dataURItoBlob = (dataURI) => {
//     const byteString = atob(dataURI.split(',')[1]);
//     const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
//     const ab = new ArrayBuffer(byteString.length);
//     const ia = new Uint8Array(ab);
//     for (let i = 0; i < byteString.length; i++) {
//       ia[i] = byteString.charCodeAt(i);
//     }
//     return new Blob([ab], { type: mimeString });
//   };

//   const Rpage = () =>{
//     return(
//       <div>
//           <h1>Face Recognition</h1>
//           <label htmlFor="name">Name:</label>
//           <input type="text" id="name" ref={nameInputRef} required />
//           <br />
//           <video id="video" width="640" height="480" autoPlay ref={videoRef}></video>
//           <br />
//           <button onClick={initWebcam}>Start Webcam</button>
//           <button onClick={capture}>Capture Photo</button>
//           <br />
//           <canvas id="canvas" width="640" height="480" style={{ display: 'none' }} ref={canvasRef}></canvas>
//           <br />
//           <button onClick={register}>Register</button>
//       </div>
//     )
//   }

//   const Lpage = () =>{
//     return(
//       <div>
//           <h1>Face Recognition</h1>
//           <label htmlFor="name">Name:</label>
//           <input type="text" id="name" ref={nameInputRef} required />
//           <br />
//           <video id="video" width="640" height="480" autoPlay ref={videoRef}></video>
//           <br />
//           <button onClick={initWebcam}>Start Webcam</button>
//           <button onClick={capture}>Capture Photo</button>
//           <br />
//           <canvas id="canvas" width="640" height="480" style={{ display: 'none' }} ref={canvasRef}></canvas>
//           <br />
//           <button onClick={login}>Login</button>
//       </div>
//     )
//   }

//   const renderContent = () => {
//     if (isLoggedIn) {
//       // Render the SuccessPage component if logged in
//       return <SuccessPage userName={userName} />;
//     } else {
//       // Render the login form if not logged in
//       if (currentPage === 'register') {
//         return <Rpage />;
//       } else if (currentPage === 'login') {
//         return <Lpage />;
//       } else {
//         return (
//           <div className = "container">
//             <h1>Face Recognition</h1>
//             <div className = "button">
//             <button onClick={() => setCurrentPage('register')}>Register</button>
//             <button onClick={() => setCurrentPage('login')}>Login</button>
//             </div>
//           </div>
//         );
//       }
//     }
//   };

//   return (
//     <div>
//       {renderContent()}
//     </div>
//   );
// }

// export default App;

