import React, { useState } from 'react';
import { Info } from 'lucide-react';

const WorkoutInputGuide = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <Info className="mr-2 text-blue-600" size={20} />
          <span className="font-semibold text-blue-800">
            Workout Input Format Guide
          </span>
        </div>
        <span className="text-blue-600">
          {isOpen ? '▲' : '▼'}
        </span>
      </div>

      {isOpen && (
        <div className="mt-4 text-sm text-gray-700">
          <p className="mb-2">
            Enter your workout details in the following format:
          </p>
          <div className="bg-white p-3 rounded-md border border-gray-200 mb-2">
            <code className="block whitespace-pre-wrap">
              #Category <br />
              -Exercise Name <br />
              -Sets x Reps <br />
              -Weight in kg <br />
              -Duration in minutes <br />
            </code>
          </div>
          
          <h4 className="font-semibold mt-2 mb-1">Example:</h4>
          <div className="bg-white p-3 rounded-md border border-gray-200">
            <code className="block whitespace-pre-wrap">
              #Legs <br />
              -Squats <br />
              -3 setsx12 reps <br />
              -50 kg <br />
              -30 min <br />
            </code>
          </div>

          <ul className="list-disc list-inside mt-2 text-xs text-gray-600">
            <li>Use '#' to specify the workout category</li>
            <li>Use '-' before each line of workout details</li>
            <li>Categories can include: Legs, Chest, Back, Arms, Shoulders</li>
            <li>Separate sets and reps with 'x'</li>
            <li>Specify weight in kilograms</li>
            <li>Enter total workout duration in minutes</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default WorkoutInputGuide;