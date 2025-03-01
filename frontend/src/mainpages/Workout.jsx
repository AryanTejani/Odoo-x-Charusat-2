import React, { useState } from 'react'
import Exercises from '../section/Exercises';
import SerachExercies from './SerachExercies';

const Workout = () => {

    const [exercise, setExercises] = useState([]);
      const [bodyparts, setBodyparts] = useState("all");
  return (
    <div>
        <SerachExercies
  setExercises={setExercises}
  bodyparts={bodyparts}
  setBodyParts={setBodyparts}
/>

      <Exercises
        exercises={exercise}
        setExercises={setExercises}
        bodyPart={bodyparts}
      />
    </div>
  )
}

export default Workout