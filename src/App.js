import './App.css';
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring, animated, config } from '@react-spring/three'
import { useRef, useState } from 'react';
import targetMind01 from "./test1.mind";
import targetMulti from "./testMulti.mind";
import { RobotPlayground } from './models/RobotPlayground';
import { ToyDinoAllosaurus } from './models/ToyDinoAllosaurus';
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import { ARAnchor, ARView } from './components/AR';
import { Particles } from './FX';

function Box() {
  let refBox = useRef();
  const [active, setActive] = useState(false)
  const { scaleValue } = useSpring({
    scaleValue: active ? 1.5 : 1,
    config: config.slow
  })

  useFrame( () => {
    refBox.current.rotation.x += 0.01;
    refBox.current.rotation.y += 0.01;
  });

  return(
    <animated.mesh ref={refBox} scale={scaleValue} onPointerOver={e => setActive(true)} onPointerOut={e => setActive(false)}>
      <boxGeometry args={[1,1,1]} />
      <meshMatcapMaterial color={0xff00ff} />
    </animated.mesh>
  )
}

function App2() {  
  return (
    <div className="App">
      <p style={{position: 'absolute'}}>Magenta Lizard 🌸🐊XD</p>
      
      <ARView
        autoplay
        flipUserCamera={false}
        imageTargets={targetMind01}
        filterMinCF={0.0001}
        filterBeta={0.001} // Speed Coefficient, increase to reduce delay
        warmupTolerance={0} // Number of continuous frames required for a target being detected to be marked as found
        missTolerance={5} // Number of continuous frames required for a target not being detected to be marked as lost
        camera={{fov: 75, near: 0.1, far: 1000, position: [0, 0, 0]}}
      >
        <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        </EffectComposer>
        <directionalLight />
        <ARAnchor target={0}>
          <ToyDinoAllosaurus/>          
        </ARAnchor>          
      </ARView>
    </div>
  );
}

function AppTest() {
  return(
    <div className="App">
      <p style={{position: 'absolute', zIndex: 1}}>Magenta Lizard 🌸🐊XD</p>
      <Canvas style={{ background: "hotpink" }}>
        <Box />
      </Canvas>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <p style={{position: 'absolute', bottom:100, left: "50%"}}>Magenta Lizard 🌸🐊XD</p>
      <div style={{position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', left:0,right:0,top:0,bottom:0}}>
        <div style={{width: "80vw", height:"80vh"}}>
          <div className='inner'>
            <div className='scanline'></div>
          </div>
        </div>
      </div>
      
      <ARView
        autoplay
        flipUserCamera={false}
        imageTargets={targetMulti}
        maxTrack={3}
        filterMinCF={0.0001}
        filterBeta={0.001} // Speed Coefficient, increase to reduce delay
        warmupTolerance={0} // Number of continuous frames required for a target being detected to be marked as found
        missTolerance={5} // Number of continuous frames required for a target not being detected to be marked as lost
        camera={{fov: 75, near: 0.1, far: 1000, position: [0, 0, 0]}}
      >
        
        <directionalLight />
        <ARAnchor target={0}>                      
            <RobotPlayground />
        </ARAnchor> 

        <ARAnchor target={1}>                      
            <Box/>       
        </ARAnchor> 

        <ARAnchor target={2}>                      
            <ToyDinoAllosaurus/>
            <Particles count={200}/>        
        </ARAnchor> 

                  
      </ARView>
    </div>
  );
}

export default App;
