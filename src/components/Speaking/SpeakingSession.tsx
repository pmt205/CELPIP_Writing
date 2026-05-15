import { useState, useRef, useEffect, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getSpeakingFeedback } from '../../utils/speakingGemini';
import { speakingTasks, getRandomQuestion, getRandomImage } from '../../data/speakingQuestions';
import { AudioRecorderUtil } from '../../utils/audioRecorder';
import SpeakingTaskSelector from './SpeakingTaskSelector';
import PrepTimer from './PrepTimer';
import AudioRecorder from './AudioRecorder';
import SpeakingFeedbackPanel from './SpeakingFeedbackPanel';
import QuestionChooser from './QuestionChooser';
import type { SpeakingFeedback, SpeakingHistory, SpeakingSession as SpeakingSessionType } from '../../types';

type SessionState = 'selecting' | 'preparing' | 'recording' | 'processing' | 'results';

export default function SpeakingSession() {
  const [state, setState] = useState<SessionState>('selecting');
  const [selectedTaskNumber, setSelectedTaskNumber] = useState<number>(0);
  const [questionText, setQuestionText] = useState('');
  const [taskName, setTaskName] = useState('');
  const [prepTime, setPrepTime] = useState(0);
  const [speakingTime, setSpeakingTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showChooser, setShowChooser] = useState(false);
  const [chooserTask, setChooserTask] = useState<number | null>(null);

  const settings = useAppStore((s) => s.settings);
  const addToSpeakingHistory = useAppStore((s) => s.addToSpeakingHistory);

  const recorderRef = useRef<AudioRecorderUtil | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const levelIntervalRef = useRef<number | null>(null);
  const stoppingRef = useRef<boolean>(false);

  const cleanupIntervals = useCallback(() => {
    if (timerIntervalRef.current !== null) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (levelIntervalRef.current !== null) {
      clearInterval(levelIntervalRef.current);
      levelIntervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupIntervals();
    };
  }, [cleanupIntervals]);

  const handleTaskSelect = (taskNumber: number) => {
    const task = speakingTasks.find((t) => t.task === taskNumber);
    if (!task) return;

    const question = getRandomQuestion(taskNumber);
    setSelectedTaskNumber(taskNumber);
    setQuestionText(question);
    setTaskName(task.name);
    setPrepTime(task.prepTime);
    setSpeakingTime(task.speakingTime);

    if (taskNumber === 3 || taskNumber === 4) {
      setSelectedImage(getRandomImage());
    } else {
      setSelectedImage(null);
    }

    setState('preparing');
  };

  const handleChoose = (taskNumber: number) => {
    setChooserTask(taskNumber);
    setShowChooser(true);
  };

  const handleQuestionSelect = (taskNum: number, question: string, imagePath?: string) => {
    const task = speakingTasks.find((t) => t.task === taskNum);
    if (!task) return;

    setSelectedTaskNumber(taskNum);
    setQuestionText(question);
    setTaskName(task.name);
    setPrepTime(task.prepTime);
    setSpeakingTime(task.speakingTime);
    setSelectedImage(imagePath || null);
    setShowChooser(false);
    setChooserTask(null);
    setState('preparing');
  };

  const handlePrepComplete = useCallback(() => {
    setState('recording');
    startRecording();
  }, []);

  const startRecording = async () => {
    try {
      const recorder = new AudioRecorderUtil();
      recorderRef.current = recorder;
      await recorder.startRecording();
      setIsRecording(true);
      setStartTime(Date.now());
      setTimeRemaining(speakingTime);

      // Countdown timer
      timerIntervalRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleStopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Audio level polling
      levelIntervalRef.current = window.setInterval(() => {
        if (recorderRef.current) {
          setAudioLevel(recorderRef.current.getAudioLevel());
        }
      }, 100);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Microphone access denied: ${err.message}`
          : 'Failed to access microphone. Please grant permission.'
      );
      setState('selecting');
    }
  };

  const handleStopRecording = useCallback(async () => {
    if (stoppingRef.current) return;
    stoppingRef.current = true;

    cleanupIntervals();
    setIsRecording(false);

    if (!recorderRef.current) {
      stoppingRef.current = false;
      setError('No active recording found.');
      setState('selecting');
      return;
    }

    try {
      const blob = await recorderRef.current.stopRecording();
      recorderRef.current = null;
      setState('processing');
      await processAudio(blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop recording');
      setState('selecting');
    }
  }, [cleanupIntervals]);

  const processAudio = async (blob: Blob) => {
    setError(null);
    try {
      // Convert blob to base64
      const base64 = await blobToBase64(blob);
      const mimeType = blob.type || 'audio/webm';

      // For tasks 3/4, fetch the image and convert to base64 for multimodal analysis
      let imageBase64: string | undefined;
      if (selectedImage && (selectedTaskNumber === 3 || selectedTaskNumber === 4)) {
        try {
          const imgResponse = await fetch(selectedImage);
          const imgBlob = await imgResponse.blob();
          const imgBase64 = await blobToBase64(imgBlob);
          imageBase64 = imgBase64;
        } catch {
          // Image fetch failed - continue without image context
        }
      }

      const result = await getSpeakingFeedback(
        settings,
        taskName,
        selectedTaskNumber,
        questionText,
        base64,
        mimeType,
        imageBase64
      );

      setFeedback(result);

      // Save to history (audio blob is NOT saved)
      const session: SpeakingSessionType = {
        id: `speaking-${Date.now()}`,
        taskNumber: selectedTaskNumber,
        taskName: taskName,
        questionText: questionText,
        transcript: result.transcript,
        startTime: startTime,
        endTime: Date.now(),
        prepTime: prepTime,
        speakingTime: speakingTime,
        submitted: true,
        imagePath: selectedImage || undefined,
      };

      const historyEntry: SpeakingHistory = {
        session,
        feedback: result,
        date: new Date().toLocaleDateString('en-CA'),
      };

      addToSpeakingHistory(historyEntry);
      setState('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get AI feedback');
      setState('selecting');
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleReset = () => {
    setState('selecting');
    setFeedback(null);
    setError(null);
    setAudioLevel(0);
    setIsRecording(false);
    setTimeRemaining(0);
    setNotes('');
    setSelectedImage(null);
    setShowChooser(false);
    setChooserTask(null);
    stoppingRef.current = false;
  };

  return (
    <section>
      {/* Error display */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              <button
                onClick={handleReset}
                className="mt-2 text-sm text-red-600 dark:text-red-300 underline hover:no-underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* State machine rendering */}
      {state === 'selecting' && <SpeakingTaskSelector onTaskSelect={handleTaskSelect} onChoose={handleChoose} />}

      {state === 'preparing' && (
        <PrepTimer
          prepSeconds={prepTime}
          taskName={taskName}
          taskNumber={selectedTaskNumber}
          questionText={questionText}
          onComplete={handlePrepComplete}
          notes={notes}
          onNotesChange={setNotes}
          imageSrc={selectedImage || undefined}
        />
      )}

      {state === 'recording' && (
        <div>
          {/* Task context */}
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Task {selectedTaskNumber} - {taskName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-lg mx-auto">
              {questionText}
            </p>
          </div>
          {/* Scene image during recording */}
          {selectedImage && (
            <div className="mb-4 flex justify-center">
              <img src={selectedImage} alt="Scene" className="rounded-lg border border-gray-200 dark:border-gray-700 max-h-[200px] object-cover" />
            </div>
          )}
          <AudioRecorder
            isRecording={isRecording}
            timeRemaining={timeRemaining}
            audioLevel={audioLevel}
            onStop={handleStopRecording}
            notes={notes}
            imageSrc={selectedImage || undefined}
          />
        </div>
      )}

      {state === 'processing' && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <svg className="animate-spin h-10 w-10 text-celpip-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Analyzing your response...
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This may take a moment while the AI evaluates your speaking.
          </p>
        </div>
      )}

      {state === 'results' && feedback && (
        <div>
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Speaking Results - Task {selectedTaskNumber}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{taskName}</p>
          </div>
          <SpeakingFeedbackPanel feedback={feedback} />
          <div className="mt-6 text-center">
            <button
              onClick={handleReset}
              className="inline-flex items-center px-6 py-3 bg-celpip-blue hover:bg-celpip-lightblue text-white font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent focus:ring-offset-2"
            >
              Practice Again
            </button>
          </div>
        </div>
      )}

      {/* Question/Image Chooser Modal */}
      {showChooser && chooserTask !== null && (
        <QuestionChooser
          taskNumber={chooserTask}
          onSelect={handleQuestionSelect}
          onClose={() => { setShowChooser(false); setChooserTask(null); }}
        />
      )}
    </section>
  );
}
