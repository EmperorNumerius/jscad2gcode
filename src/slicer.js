import { BufferGeometry, Vector3 } from 'three';
import { Earcut } from 'three/src/extras/Earcut';

/**
 * Slices an STL model into layers.
 * @param {string} stlContent - The content of the STL file as a string.
 * @param {number} layerHeight - The height of each layer.
 * @returns {Array} - An array of layers where each layer is an array of polygons representing the slice at that height.
 */
export const sliceModel = (stlContent, layerHeight) => {
  const geometry = parseSTL(stlContent);
  const layers = [];
  const zMin = geometry.boundingBox.min.z;
  const zMax = geometry.boundingBox.max.z;

  for (let z = zMin; z <= zMax; z += layerHeight) {
    const polygons = getPolygonsAtZ(geometry, z);
    if (polygons.length > 0) {
      layers.push(polygons);
    }
  }

  return layers;
};

/**
 * Parses the STL content and returns a THREE.BufferGeometry.
 * @param {string} stlContent - The content of the STL file as a string.
 * @returns {THREE.BufferGeometry} - The parsed geometry.
 */
const parseSTL = (stlContent) => {
  const loader = new STLLoader();
  const geometry = loader.parse(stlContent);

  geometry.computeBoundingBox();

  return geometry;
};

/**
 * Gets the polygons at a specific Z height from the geometry.
 * @param {THREE.BufferGeometry} geometry - The geometry of the model.
 * @param {number} z - The Z height.
 * @returns {Array} - An array of polygons at the specified Z height.
 */
const getPolygonsAtZ = (geometry, z) => {
  const vertices = geometry.attributes.position.array;
  const polygons = [];

  for (let i = 0; i < vertices.length; i += 9) {
    const v0 = new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
    const v1 = new Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5]);
    const v2 = new Vector3(vertices[i + 6], vertices[i + 7], vertices[i + 8]);

    if ((v0.z <= z && v1.z >= z) || (v1.z <= z && v2.z >= z) || (v2.z <= z && v0.z >= z)) {
      const intersection = getIntersectionWithZ([v0, v1, v2], z);
      if (intersection.length > 0) {
        polygons.push(intersection);
      }
    }
  }

  return polygons;
};

/**
 * Gets the intersection points of a triangle with a specific Z height.
 * @param {Array} triangle - An array of THREE.Vector3 representing the triangle vertices.
 * @param {number} z - The Z height.
 * @returns {Array} - An array of intersection points.
 */
const getIntersectionWithZ = (triangle, z) => {
  const intersections = [];

  for (let i = 0; i < 3; i++) {
    const v0 = triangle[i];
    const v1 = triangle[(i + 1) % 3];

    if ((v0.z <= z && v1.z >= z) || (v1.z <= z && v0.z >= z)) {
      const t = (z - v0.z) / (v1.z - v0.z);
      const x = v0.x + t * (v1.x - v0.x);
      const y = v0.y + t * (v1.y - v0.y);
      intersections.push(new Vector3(x, y, z));
    }
  }

  return intersections;
};
