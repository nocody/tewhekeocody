import React, { useRef, useState, Suspense } from 'react'
import './App.scss'
import { Canvas, useFrame, useLoader, extend } from "@react-three/fiber";
import * as THREE from 'three';
import { BoxBufferGeometry, MeshStandardMaterial } from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useGLTF, OrbitControls, MeshDistortMaterial, MeshWobbleMaterial, useTexture, Text, Environment, Stars, Plane, shaderMaterial } from '@react-three/drei';

import glsl from 'glslify';

// import fragment from "./shader/fragment.glsl";
// import vertex from "./shader/vertex.glsl";

// import model from "../model/modelpractice.gltf";
// import Model from "../src/model";




const ShiftMaterial = shaderMaterial(
  { u_time:{type: "f", value: 0}, color: new THREE.Color(0xcdacac), borderWidth: 0.5, borderColor: new THREE.Color(0xffffff), blur: 50.0, amount: 25.0},
  // vertex shader
  glsl`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
  `,
  // fragment shader
  glsl`
  // Created by inigo quilez - iq/2013
  // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  
  
  // I've not seen anybody out there computing correct cell interior distances for Voronoi
  // patterns yet. That's why they cannot shade the cell interior correctly, and why you've
  // never seen cell boundaries rendered correctly.
  
  // However, here's how you do mathematically correct distances (note the equidistant and non
  // degenerated grey isolines inside the cells) and hence edges (in yellow):
  
  // http://www.iquilezles.org/www/articles/voronoilines/voronoilines.htm
  
  // Altered for a Three.js ShaderMaterial demo by Chris Brown - blog.2pha.com
  
  
  
  varying vec2 vUv;
  uniform vec3 color;
  uniform vec3 borderColor;
  uniform float borderWidth;
  uniform float blur;
  uniform float amount;
  uniform float u_time;

  
  vec2 hash2( vec2 p )
  {
      // procedural white noise
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
  }
  
  vec3 voronoi( in vec2 x )
  {
      vec2 n = floor(x);
      vec2 f = fract(x);
  
      //----------------------------------
      // first pass: regular voronoi
      //----------------------------------
    vec2 mg, mr;
  
      float md = 8.0;
      for( int j=-1; j<=1; j++ )
      for( int i=-1; i<=1; i++ )
      {
          vec2 g = vec2(float(i),float(j));
          vec2 o = hash2( n + g );
          vec2 r = g + o - f;
          float d = dot(r,r);
  
          if( d<md )
          {
              md = d;
              mr = r;
              mg = g;
          }
      }
  
      //----------------------------------
      // second pass: distance to borders
      //----------------------------------
      md = 8.0;
      for( int j=-2; j<=2; j++ )
      for( int i=-2; i<=2; i++ )
      {
          vec2 g = mg + vec2(float(i),float(j));
          vec2 o = hash2( n + g );
          vec2 r = g + o - f;
  
          if( dot(mr-r,mr-r)>0.00001 )
          md = min( md, dot( 0.5*(mr+r), normalize(r-mr) ) );
      }
  
      return vec3( md, mr );
  }

  vec3 colorA = vec3(0.149,0.141,0.912);
  vec3 colorB = vec3(1.000,0.833,0.224);  

  void main() {
    vec3 c = voronoi( 8.0*(vUv*vec2(amount)) );
    // borders
    float pct = abs(sin(u_time));
    float blurA = 50.0 * abs(sin(u_time));
    float borderWidthA = (cos(u_time) +1.0) * 2.0;
    vec3 colorc = mix(colorA, colorB, pct);
    vec3 col = mix( borderColor, colorc, smoothstep( borderWidth/100.0, (borderWidth/100.0)+(blurA/100.0), c.x) );
   
    
    //original
    // vec3 col = mix( borderColor, color, smoothstep( borderWidth/100.0, (borderWidth/100.0)+(blurA/100.0), c.x) );
    gl_FragColor = vec4(col, 1.0);
  }
  `
)

extend({ ShiftMaterial })

function Model(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('../model/wheke3.glb')
  
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Roundcube.geometry} material={nodes.Roundcube.material}>
        {/* <shiftMaterial attach='material'/> */}
         {/* <MeshWobbleMaterial
          attach="material"
          distort={0.5} // Strength, 0 disables the effect (default=1)
          speed={1} // Speed (default=1)
          color={'#A94F2E'}
          
          />  */}
          <MeshDistortMaterial
          attach="material"
          distort={0.5} // Strength, 0 disables the effect (default=1)
          speed={1} // Speed (default=1)
          color={'#A94F2E'}
          
          /> 
      </mesh>
    </group>
  )
}

const WhekeMesh = ({ position, args }) => {
  const mesh = useRef(null);    
  // useFrame(() => (mesh.current));
  useFrame(({ clock }) => {
    mesh.current.material.uniforms.u_time.value = clock.oldTime * 0.0001;
  });
  
  return(
    <mesh  position={position} ref={mesh}>
        <sphereBufferGeometry attach='geometry' args={args}/>
 
        {/* <MeshDistortMaterial
          attach="material"
          distort={0.25} // Strength, 0 disables the effect (default=1)
          speed={1} // Speed (default=1)
          
          /> */}

          
          <shiftMaterial attach="material" />

          
      </mesh>
  )
}



function App() {

  // const [colorMap] = useLoader(TextureLoader, ['space-skybox.png'])

  return (
    
  
    <>
    <Canvas camera={{ fov: 100, near: 0.1, far: 10000, position:[10, 0, 0] }}>

      <Stars />
    
      
      <OrbitControls />
      <ambientLight/>
      <directionalLight
      // we are setting the position
        position={[0, 0, 5]}
       // we are setting the color
      //  color="red"
      />
      <pointLight
      // we are setting the position
        position={[50, 50, 50]}
       // we are setting the color
      //  color="red"
      />

      {/* <Model /> */}

      <WhekeMesh position={[0, 0, 0]} args={[12, 12, 100]} />
      <Suspense fallback='null'>
        <Model />
      </Suspense>
      
      
      </Canvas>
    </>
 
  );
}

export default App
