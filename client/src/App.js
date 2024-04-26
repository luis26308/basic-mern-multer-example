
import {useEffect, useState } from 'react'
import axios from 'axios';
import './App.css';

function App() {
  let [image, setImage] = useState(null)
  let [filename, setFilename] = useState(null)

  useEffect(()=> {
    console.log(image)
  }, [image])

  useEffect(()=> {
    console.log(filename)
    if (filename){
      getImages()
    }
  }, [filename])

  const getImages = async () => {
    const response = await axios.get(`http://localhost:8000/image/${filename}`)
    console.log(response.data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let formData = new FormData()
    formData.append('image', image)
   const response = await axios.post(`http://localhost:8000/upload`, formData)

   if (response.status === 200){
    console.log(response.data)
    setFilename(response.data.filename)
   } else {
    console.log(response)
   }
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
          <input type='file' onChange={(e)=>setImage(e.target.files[0])}/>
          <input type='submit'/>
      </form>
    {filename && (
      <img src={`http://localhost:8000/image/${filename}`}/>
    )}
    </div>
  );
}

export default App;
