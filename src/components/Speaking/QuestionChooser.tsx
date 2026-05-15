import { getQuestionsForTask, getAllImages, speakingTasks } from '../../data/speakingQuestions';

interface QuestionChooserProps {
  taskNumber: number;
  onSelect: (taskNumber: number, questionText: string, imagePath?: string) => void;
  onClose: () => void;
}

export default function QuestionChooser({ taskNumber, onSelect, onClose }: QuestionChooserProps) {
  const taskInfo = speakingTasks.find((t) => t.task === taskNumber);
  const questions = getQuestionsForTask(taskNumber);
  const images = getAllImages();
  const isImageTask = taskNumber === 3 || taskNumber === 4;

  const fixedQuestion =
    taskNumber === 3
      ? 'Describe what is happening in the picture.'
      : 'What do you think will happen next in this situation?';

  const handleRandom = () => {
    if (isImageTask) {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      onSelect(taskNumber, fixedQuestion, randomImage);
    } else if (questions && questions.length > 0) {
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      onSelect(taskNumber, randomQuestion);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Task {taskNumber} - {taskInfo?.name || ''}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {isImageTask ? 'Select an image' : 'Select a question'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Random button */}
        <div className="px-5 pt-4">
          <button
            onClick={handleRandom}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-celpip-accent hover:bg-celpip-lightblue rounded-lg shadow-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Random
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {isImageTask ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((imagePath, index) => (
                <button
                  key={imagePath}
                  onClick={() => onSelect(taskNumber, fixedQuestion, imagePath)}
                  className="group relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600 hover:border-celpip-accent transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent"
                >
                  <img
                    src={imagePath}
                    alt={`Scene ${index + 1}`}
                    className="w-full h-28 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <span className="absolute bottom-1 right-1 text-xs bg-black/60 text-white px-1.5 py-0.5 rounded">
                    {index + 1}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {questions && questions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => onSelect(taskNumber, question)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-celpip-accent hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-sm text-gray-700 dark:text-gray-200"
                >
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500 mr-2">
                    {index + 1}.
                  </span>
                  {question}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
