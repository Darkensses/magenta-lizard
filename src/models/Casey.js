/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: vaess (https://sketchfab.com/vaess)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/casey-ee2007e6c1c74aa2828eeebd28af9eb1
title: Casey
*/

import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import model from "./casey.glb"

export function Casey(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(model);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    actions[names[0]].fadeIn().play();
  }, [actions,names]);

  return (
    <group scale={0.5} position={[0,-0.1,-5]} ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group
          name="Sketchfab_model"
          rotation={[-Math.PI / 2, 0, 0]}
          scale={0.03}
        >
          <group
            name="5cf7e2beffca4ba7ac7395cd842db313fbx"
            rotation={[Math.PI / 2, 0, 0]}
          >
            <group name="Object_2">
              <group name="RootNode">
                <group name="Object_4">
                  <primitive object={nodes._rootJoint} />
                  <group
                    name="Object_6"
                    position={[0, 43.49, 1.89]}
                    scale={0.51}
                  />
                  <group name="Casey" scale={0.51} />
                  <skinnedMesh
                    name="Object_8"
                    geometry={nodes.Object_8.geometry}
                    material={materials.Material_50}
                    skeleton={nodes.Object_8.skeleton}
                  />
                  <skinnedMesh
                    name="Object_7"
                    geometry={nodes.Object_7.geometry}
                    material={materials.Material_49}
                    skeleton={nodes.Object_7.skeleton}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/casey.glb");
