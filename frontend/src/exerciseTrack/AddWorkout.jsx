// AddWorkout.jsx - Enhanced version
const AddWorkout = ({ workout, setWorkout, addNewWorkout, buttonLoading }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.from(cardRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      });
    }
  }, []);

  return (
    <div 
      id="workout-form"
      ref={cardRef}
      className="flex-1 min-w-[280px] p-6 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg bg-white dark:bg-gray-800 flex flex-col gap-4"
    >
      <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add New Workout
      </h3>
      
      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-xs text-gray-600 dark:text-gray-300 mb-2">
        <p className="font-semibold mb-1">Format your workout like this:</p>
        <pre className="bg-gray-100 dark:bg-gray-600 p-2 rounded overflow-auto">
{`#Category
-Exercise Name
-Sets X Reps
-Weight (kg)
-Duration (min)`}
        </pre>
      </div>
      
      <TextInput
        label="Workout Details"
        textArea
        rows={8}
        placeholder={`Example:
#Legs
-Back Squat
-5 setsX15 reps
-30 kg
-10 min`}
        value={workout}
        handelChange={(e) => setWorkout(e.target.value)}
      />
      
      <Button
        text={buttonLoading ? "Adding..." : "Add Workout"}
        rightIcon={
          !buttonLoading && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          )
        }
        onClick={addNewWorkout}
        isLoading={buttonLoading}
        isDisabled={buttonLoading || !workout.trim()}
        full
      />
    </div>
  );
};

export default AddWorkout;