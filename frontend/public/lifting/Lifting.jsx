/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 scene.gltf --transform 
Files: scene.gltf [5.33KB] > D:\Gym\frontend\public\lifting\scene-transformed.glb [469.37KB] (-8706%)
Author: Logan Rinaldis (https://sketchfab.com/loganrinaldis)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/weight-lifting-set-9fa5593a7a4042e4b7bbdc84c0375679
Title: Weight Lifting Set
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/scene-transformed.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Box001__0.geometry} material={materials['Scene_-_Root']} position={[-38.836, 0, -71.992]} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  )
}

useGLTF.preload('/scene-transformed.glb')
