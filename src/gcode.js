/**
 * Generates G-code from toolpaths.
 * @param {Array} toolpaths - An array of toolpath objects containing the coordinates and extrusion information.
 * @returns {string} - The generated G-code as a string.
 */
export const generateGCode = (toolpaths) => {
    let gcode = '';
  
    // Add G-code header
    gcode += `; G-code generated by custom slicer\n`;
    gcode += `G21 ; set units to millimeters\n`;
    gcode += `G90 ; use absolute coordinates\n`;
    gcode += `M82 ; use absolute distances for extrusion\n`;
    gcode += `G28 ; home all axes\n`;
    gcode += `G1 Z15.0 F9000 ; move the platform down 15 mm\n`;
    gcode += `G92 E0 ; zero the extruded length\n`;
    gcode += `G1 F140 E30 ; extrude 30mm of feed stock\n`;
    gcode += `G92 E0 ; zero the extruded length again\n`;
    gcode += `G1 F9000\n`;
  
    // Add toolpaths
    toolpaths.forEach(layer => {
      gcode += `; Layer ${layer.layerIndex}\n`;
      layer.paths.forEach(path => {
        path.forEach(point => {
          gcode += `G1 X${point.x.toFixed(2)} Y${point.y.toFixed(2)} Z${point.z.toFixed(2)} E${point.e.toFixed(4)} F${point.f}\n`;
        });
      });
    });
  
    // Add G-code footer
    gcode += `; End of print\n`;
    gcode += `M104 S0 ; turn off extruder\n`;
    gcode += `M140 S0 ; turn off bed\n`;
    gcode += `G91 ; relative positioning\n`;
    gcode += `G1 E-1 F300 ; retract the filament a bit before lifting the nozzle to release some of the pressure\n`;
    gcode += `G1 Z+0.5 E-5 X-20 Y-20 F9000 ; move Z up a bit and retract filament even more\n`;
    gcode += `G28 X0 Y0 ; move X/Y to min endstops, so the head is out of the way\n`;
    gcode += `M84 ; disable motors\n`;
    gcode += `G90 ; absolute positioning\n`;
  
    return gcode;
  };
  