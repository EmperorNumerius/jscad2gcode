/**
 * Generates toolpaths from sliced layers.
 * @param {Array} layers - An array of layers where each layer is an array of polygons representing the slice at that height.
 * @returns {Array} - An array of toolpath objects containing the coordinates and extrusion information.
 */
export const generateToolpaths = (layers) => {
    const toolpaths = [];
  
    layers.forEach((layer, layerIndex) => {
      const layerToolpaths = {
        layerIndex,
        paths: []
      };
  
      let previousPoint = null;
      layer.forEach(polygon => {
        polygon.forEach(point => {
          const path = [];
          polygon.forEach((vertex, vertexIndex) => {
            const x = vertex[0];
            const y = vertex[1];
            const z = layerIndex * 0.2; // Example layer height of 0.2 mm
            let e = 0;
  
            if (previousPoint) {
              const distance = Math.sqrt(
                Math.pow(x - previousPoint.x, 2) +
                Math.pow(y - previousPoint.y, 2) +
                Math.pow(z - previousPoint.z, 2)
              );
              e = distance * 0.05; // Example extrusion multiplier
            }
  
            const pointData = {
              x,
              y,
              z,
              e,
              f: 1500 // Example feed rate
            };
  
            path.push(pointData);
            previousPoint = pointData;
          });
  
          layerToolpaths.paths.push(path);
        });
      });
  
      toolpaths.push(layerToolpaths);
    });
  
    return toolpaths;
  };
  