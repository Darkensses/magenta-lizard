import * as THREE from 'three'
import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

function Swarm({ count }) {
  const mesh = useRef()
  const light = useRef()
  const { viewport, mouse } = useThree()

  const dummy = useMemo(() => new THREE.Object3D(), [])
  // Generate some random positions, speed factors and timings
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = -50 + Math.random() * 100
      const yFactor = -50 + Math.random() * 100
      const zFactor = -50 + Math.random() * 100
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count])
  // The innards of this hook will run every frame
  useFrame((state) => {
    // Makes the light follow the mouse
    light.current.position.set((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0)
    // Run through the randomized data to calculate some movement
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      // There is no sense or reason to any of this, just messing around with trigonometric functions
      t = particle.t += speed / 2
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)
      particle.mx += mouse.x * viewport.width * particle.mx * 0.01
      particle.my += mouse.y * viewport.height * particle.my * 0.01
      // Update the dummy object
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      )
      dummy.scale.set(s, s, s)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()
      // And apply the matrix to the instanced item
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })
  return (
    <>
      <pointLight ref={light} distance={60} intensity={20} color="red">
        <mesh scale={[4, 4, 40]}>
          <dodecahedronGeometry />
        </mesh>
      </pointLight>
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="black" />
      </instancedMesh>
    </>
  )
}

const particlesFragmentShader = `
varying float vDistance;

void main() {
  vec3 color = vec3(0.34, 0.53, 0.96);
  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = 1.0 - strength;
  strength = pow(strength, 3.0);

  color = mix(color, vec3(0.97, 0.70, 0.45), vDistance * 0.5);
  color = mix(vec3(0.0), color, strength);
  gl_FragColor = vec4(color, strength);
}
`
const particlesVertexShader = `
uniform float uTime;
uniform float uRadius;

varying float vDistance;

// Source: https://github.com/dmnsgn/glsl-rotate/blob/main/rotation-3d-y.glsl.js
mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    c, 0.0, -s,
    0.0, 1.0, 0.0,
    s, 0.0, c
  );
}


void main() {
  float distanceFactor = pow(uRadius - distance(position, vec3(0.0)), 1.5);
  float size = distanceFactor * 10.0 + 10.0;
  vec3 particlePosition = position * rotation3dY(uTime * 0.3 * distanceFactor);

  vDistance = distanceFactor;

  vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = size;
  // Size attenuation;
  gl_PointSize *= (10000.0 / - viewPosition.z);
}

`

const Particles = (props) => {
    const { count } = props;
    const radius = 2;
  
    // This reference gives us direct access to our points
    const points = useRef();
  
    // Generate our positions attributes array
    const particlesPosition = useMemo(() => {
      const positions = new Float32Array(count * 3);
      
      for (let i = 0; i < count; i++) {
        const distance = Math.sqrt(Math.random()) * radius;
        const theta = THREE.MathUtils.randFloatSpread(360); 
        const phi = THREE.MathUtils.randFloatSpread(360); 
  
        let x = distance * Math.sin(theta) * Math.cos(phi)/2.0;
        let y = distance * Math.sin(theta) * Math.sin(phi)/2.0;
        let z = distance * Math.cos(theta);
  
        positions.set([x, y, z], i * 3);
      }
      
      return positions;
    }, [count]);
  
    const uniforms = useMemo(() => ({
      uTime: {
        value: 0.0
      },
      uRadius: {
        value: radius
      }
    }), [])
  
    useFrame((state) => {
      const { clock } = state;
  
      points.current.material.uniforms.uTime.value = clock.elapsedTime;
    });
  
    return (
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fragmentShader={particlesFragmentShader}
          vertexShader={particlesVertexShader}
          uniforms={uniforms}
        />
      </points>
    );
  };

export { Swarm, Particles };