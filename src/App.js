import './App.css';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated, config } from '@react-spring/three';
import { useSpring as useSpringWeb, animated as animatedWeb, config as configWeb} from '@react-spring/web'

import { ARAnchor, ARView } from './components/AR';
import { Particles } from './FX';

import { RobotPlayground } from './models/RobotPlayground';
import { AnimatedDK } from './models/AnimatedDK';
import { ToyDinoAllosaurus } from './models/ToyDinoAllosaurus';
import { SpectralCircles } from './models/SpectralCircles';
import { HeartEmoji } from './models/HeartEmoji';
import { SantaScene } from './models/SantaScene';
import { LetterForSanta } from './models/LetterForSanta';

import targetMulti from "./targets.mind";

function Box() {
  let refBox = useRef();
  const [active, setActive] = useState(false)
  const { scaleValue } = useSpring({
    scaleValue: active ? 1.5 : 1,
    config: config.slow
  });

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

function App() {
  const [scan, setScan] = useState(true);
  const { opacity } = useSpringWeb({
    opacity: scan ? 1 : 0,
    config: configWeb.slow
  })

  return (
    <div className="App">

      <animatedWeb.div style={{opacity: opacity, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', left:0,right:0,top:0,bottom:0}}>
        <div style={{width: "90vw", height:"70vh"}}>
          <div className='inner'>
            <div className='scanline'></div>
            <div className='animation-reversed'></div>
          </div>
        </div>
      </animatedWeb.div>
      
      <ARView
        autoplay
        flipUserCamera={true}
        imageTargets={targetMulti}
        maxTrack={6}
        filterMinCF={0.0001}
        filterBeta={0.001} // Speed Coefficient, increase to reduce delay
        warmupTolerance={0} // Number of continuous frames required for a target being detected to be marked as found
        missTolerance={5} // Number of continuous frames required for a target not being detected to be marked as lost
        camera={{fov: 75, near: 0.1, far: 1000, position: [0, 0, 0]}}
      >
        <ambientLight />
        <directionalLight position={[0,0,5]} intensity={1}/>
        <ARAnchor target={0} onAnchorFound={() => setScan(false)} onAnchorLost={() => setScan(true)}>                      
            <RobotPlayground />
        </ARAnchor> 

        <ARAnchor target={1} onAnchorFound={() => setScan(false)} onAnchorLost={() => setScan(true)}>                      
            <AnimatedDK />       
        </ARAnchor> 

        <ARAnchor target={2} onAnchorFound={() => setScan(false)} onAnchorLost={() => setScan(true)}>                      
            <ToyDinoAllosaurus/>
            <Particles count={200}/>        
        </ARAnchor>

        <ARAnchor target={3} onAnchorFound={() => setScan(false)} onAnchorLost={() => setScan(true)}>                      
            <SpectralCircles />       
        </ARAnchor> 

        <ARAnchor target={4} onAnchorFound={() => setScan(false)} onAnchorLost={() => setScan(true)}>
          <HeartEmoji position={[-0.8,0.1,0]} rotation={[0,180*Math.PI/180,0]}/>
          <HeartEmoji position={[0.8,0.15,0]} rotation={[0,180*Math.PI/180,0]}/>
          <HeartEmoji position={[-0.5,0,0]} rotation={[0,180*Math.PI/180,0]}/>
          <HeartEmoji position={[0.5,-0.1,0]} rotation={[0,180*Math.PI/180,0]}/>
          <HeartEmoji position={[0,0.2,0]} rotation={[0,180*Math.PI/180,0]}/>
          <HeartEmoji position={[0,-0.2,0]} rotation={[0,180*Math.PI/180,0]}/>
        </ARAnchor> 

        <ARAnchor target={5} onAnchorFound={() => setScan(false)} onAnchorLost={() => setScan(true)}>                      
            <SantaScene />
            <LetterForSanta />   
        </ARAnchor> 

                  
      </ARView>
    </div>
  );
}

export default App;
