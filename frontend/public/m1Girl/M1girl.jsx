/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 scene.gltf 
Author: 3DPeopleOfficial (https://sketchfab.com/3DPeopleOfficial)
License: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
Source: https://sketchfab.com/3d-models/juliette-10781-free-sport-girl-a845ee56f0344625bff4833c447b94df
Title: Juliette 10781 - Free Sport Girl
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/m1Girl/scene.gltf')
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.011}>
        <mesh geometry={nodes.Object_2.geometry} material={materials.defaultMat} />
        <mesh geometry={nodes.Object_3.geometry} material={materials.defaultMat} />
      </group>
    </group>
  )
}

useGLTF.preload('/m1Girl/scene.gltf')
