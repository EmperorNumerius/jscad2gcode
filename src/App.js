import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import 'brace/mode/javascript';
import 'brace/theme/github';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import './App.css';
import * as scad from 'scad-js';
import STLViewer from './components/STLViewer';

const App = () => {
  const [jsCode, setJsCode] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [stlUrl, setStlUrl] = useState('');
  const [gcodeLink, setGcodeLink] = useState('');
  const [error, setError] = useState('');
  const [filamentType, setFilamentType] = useState('PLA');
  const [printerSize, setPrinterSize] = useState('200x200x200');

  const convertCodeToSTL = async () => {
    setError('');
    try {
      const scadCode = scad.jsToScad(jsCode);
      const stl = await scad.compile(scadCode);

      const response = await axios.post('/api/saveStl', { stl });
      if (response.data.success) {
        setDownloadLink(response.data.fileUrl);
        setStlUrl(response.data.fileUrl);
      } else {
        setError('Conversion failed');
      }
    } catch (error) {
      console.error('Error converting code to STL:', error);
      setError('Conversion failed');
    }
  };

  const handleCustomSlice = async () => {
    setError('');
    try {
      const response = await axios.post('/api/customSlice', {
        filePath: stlUrl,
        filamentType,
        printerSize,
      });
      if (response.data.success) {
        setGcodeLink(response.data.fileUrl);
      } else {
        setError(response.data.error || 'Slicing failed');
      }
    } catch (error) {
      console.error('Error slicing file:', error);
      setError('Slicing failed');
    }
  };

  return (
    <div className="App">
      <h1>3D Converter</h1>
      <AceEditor
        mode="javascript"
        theme="github"
        name="codeEditor"
        onChange={newValue => setJsCode(newValue)}
        value={jsCode}
        width="100%"
        height="300px"
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
      />
      <button onClick={convertCodeToSTL}>Convert to STL</button>
      {downloadLink && (
        <div>
          <a href={downloadLink} download="model.stl">Download STL</a>
          <STLViewer url={downloadLink} />
          <div>
            <h2>Slicing Options</h2>
            <label>
              Filament Type:
              <input type="text" value={filamentType} onChange={e => setFilamentType(e.target.value)} />
            </label>
            <label>
              Printer Size:
              <input type="text" value={printerSize} onChange={e => setPrinterSize(e.target.value)} />
            </label>
            <button onClick={handleCustomSlice}>Slice (Custom)</button>
          </div>
          {gcodeLink && (
            <div>
              <a href={gcodeLink} download="model.gcode">Download G-code</a>
            </div>
          )}
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default App;
