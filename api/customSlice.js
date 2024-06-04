const fs = require('fs');
const path = require('path');
const { sliceModel, generateToolpaths, generateGCode } = require('../src/slicer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { filePath, filamentType, printerSize } = req.body;

  try {
    // Load the STL file
    const stlFilePath = path.join(__dirname, '../public', filePath);
    const stlFile = fs.readFileSync(stlFilePath, 'utf8');

    // Replace this with actual slicing logic
    const layers = sliceModel(stlFile, 0.2); // Example layer height of 0.2 mm
    const toolpaths = generateToolpaths(layers);
    const gcode = generateGCode(toolpaths);

    // Save the generated G-code to a file
    const gcodeFilePath = path.join(__dirname, '../public/model.gcode');
    fs.writeFileSync(gcodeFilePath, gcode);

    return res.json({ success: true, fileUrl: `/model.gcode` });
  } catch (error) {
    console.error('Error slicing file:', error);
    return res.json({ success: false, error: 'Slicing failed' });
  }
};
