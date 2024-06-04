import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const STLViewer = ({ url }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // Set up the orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Set up lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 1).normalize();
    scene.add(directionalLight);

    // Load the STL model
    const loader = new STLLoader();
    loader.load(url, geometry => {
      const material = new THREE.MeshPhongMaterial({ color: 0x555555, specular: 0x111111, shininess: 200 });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Center the camera on the model
      const middle = new THREE.Vector3();
      const size = new THREE.Vector3();
      new THREE.Box3().setFromObject(mesh).getCenter(middle);
      new THREE.Box3().setFromObject(mesh).getSize(size);

      mesh.position.x = mesh.position.x - middle.x;
      mesh.position.y = mesh.position.y - middle.y;
      mesh.position.z = mesh.position.z - middle.z;

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 4 * Math.tan(fov * 2));

      cameraZ *= 2; // Add some distance

      camera.position.z = cameraZ;

      const minZ = mesh.position.z + size.z / 2 + cameraZ;
      const minY = mesh.position.y + size.y / 2 + cameraZ;
      camera.position.set(0, minY, minZ);
    });

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      controls.dispose();
    };
  }, [url]);

  return <div ref={mountRef} style={{ width: '100%', height: '500px' }} />;
};

export default STLViewer;
