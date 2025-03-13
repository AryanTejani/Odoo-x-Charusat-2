import { Home, Dumbbell, Calendar, Plus, Clock, Flame } from "lucide-react";

const WorkoutCard = ({ workout }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
        <h3 className="font-bold text-lg">{workout.workoutName || "Workout"}</h3>
        <div className="text-sm opacity-90">
          {new Date(workout.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-5">
        <div className="flex flex-col gap-3">
          <div className="border-b pb-3 border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              {workout.workoutName}
            </p>
            <div className="flex gap-4 mt-1">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Dumbbell className="h-4 w-4 mr-1" />
                {workout.sets} sets
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="h-4 w-4 mr-1">🏋️</span>
                {workout.reps} reps
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Flame className="h-4 w-4 mr-1" />
                {workout.weight} kg
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700 flex justify-between text-sm">
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <Clock className="h-4 w-4 mr-1" />
          {workout.duration || "N/A"} min
        </div>
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <Flame className="h-4 w-4 mr-1" />
          {workout.caloriesBurned || "0"} cal
        </div>
      </div>
    </div>
  );
};
export default WorkoutCard;