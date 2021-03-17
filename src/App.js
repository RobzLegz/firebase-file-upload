import React, { useState } from 'react';
import storage from './private/firebase';
import firebase from "firebase";

function App() {

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [image, setImage] = useState(null)

  const handleChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = () => {
    const uploadTask = storage.ref(`/images/${file.name}`).put(file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
      let percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(percent + "% done");
      setProgress(Math.floor(percent));
    }, console.error, () => {
      storage.ref(`/images/${file.name}`).getDownloadURL().then((url) => {
        setFile(null);
        setImage(url)
        console.log("Uploaded", url)
      })
    })
  }

  console.log(file)

  return (
    <div>
      {progress && (
        <progress id="file" max="100" value={progress} >{progress}%</progress>
      )}
      <input onChange={handleChange} type="file" />
      <button disabled={!file} onClick={handleUpload} type="submit">Upload to firebase</button>
      <img src={image} alt="image"/>
    </div>
  )
}

export default App
