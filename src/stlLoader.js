import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

/**
 * Loads an STL file from a URL and returns a promise that resolves with the geometry.
 * @param {string} url - The URL of the STL file.
 * @returns {Promise<THREE.BufferGeometry>} - A promise that resolves with the geometry of the STL model.
 */
export const loadSTLFromURL = (url) => {
  return new Promise((resolve, reject) => {
    const loader = new STLLoader();
    loader.load(
      url,
      (geometry) => {
        resolve(geometry);
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
};

/**
 * Loads an STL file from a file content string and returns a promise that resolves with the geometry.
 * @param {string} fileContent - The content of the STL file as a string.
 * @returns {Promise<THREE.BufferGeometry>} - A promise that resolves with the geometry of the STL model.
 */
export const loadSTLFromFileContent = (fileContent) => {
  return new Promise((resolve, reject) => {
    const loader = new STLLoader();
    const geometry = loader.parse(fileContent);
    if (geometry) {
      resolve(geometry);
    } else {
      reject(new Error('Failed to parse STL file content'));
    }
  });
};
