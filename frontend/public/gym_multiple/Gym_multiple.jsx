/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 scene.gltf --transform 
Files: scene.gltf [9.58KB] > D:\Gym\frontend\public\gym_multiple\scene-transformed.glb [425.46KB] (-4341%)
Author: Francesco Coldesina (https://sketchfab.com/topfrank2013)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/gym-multiple-df5e938192244b82a1e59c7145030ee0
Title: Gym Multiple
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function GymMul(props) {
  const { nodes, materials } = useGLTF('gym_multiple/scene-transformed.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Object_3.geometry} material={materials.CABLES001} position={[-40.712, 0, 36.395]} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Object_4.geometry} material={materials.MAINFRAME001} position={[-40.712, 0, 36.395]} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Object_5.geometry} material={materials.Weights002} position={[-40.712, 0, 36.395]} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  )
}

useGLTF.preload('/scene-transformed.glb')
