
import './App.css';
import React, { useState, useEffect } from 'react'
const API_BACKEND = process.env.REACT_APP_BACK_END;
function App() {
  const [memes, setMemes] = useState([]);
  const [file, setFile] = useState(null)
  const [texts, setTexts] = useState('')
  useEffect(() => {
    async function getMemes() {
      const resp = await fetch(API_BACKEND + '/api/memes')
      const data = await resp.json()
      console.log({data})
      setMemes(data.data)

    }
    getMemes()
  }, [])
  const handleCreateMeme = async (e) => {
    e.preventDefault()
    if (!file) alert('Please Choose the File')
    const formData = new FormData()
    formData.append('image', file)
    formData.append("texts", JSON.stringify([
      {
      "size": 128,
      "color": "WHITE",
      "alignmentX": "HORIZONTAL_ALIGN_CENTER",
      "alignmentY": "VERTICAL_ALIGN_BOTTOM",
      "content": texts
      },
    ]));

    const resp = await fetch(API_BACKEND+'/api/memes',
      {
        method: 'POST',
        body: formData

      })
    const data = await resp.json()
    if (data && data.outputMemePath) {
      setMemes([data, ...memes]);
    } else {
      console.error('Received unexpected data structure', data);
    }

  }
  return (
    <div className="App">
      <h1> Create Meme</h1>
      <form>
        <input type = "text" placeholder = "Enter your text" onChange={(e) => setTexts(e.target.value)}/>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleCreateMeme}>Upload File </button>
      </form>
      <h1>Memes</h1>
      {memes.map((m, index) => {
        if (!m || !m.outputMemePath) {
          console.error('Malformed meme data at index', index, m);
          return null; // Skip rendering this item
        }
        const url = 'http://localhost:5800' + m.outputMemePath.split('public')[1];
        return <img key={index} src={url} style={{ height: 450, width: 400 }} alt="Uploaded meme" />;
      })}

    </div>
  );
}

export default App;
