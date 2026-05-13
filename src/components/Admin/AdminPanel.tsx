import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { loadFromStorage, saveToStorage } from '../../utils/localStorage';
import defaultQuestions from '../../data/questions.json';
import type { Task1Question, Task2Question } from '../../types';

const CUSTOM_QUESTIONS_KEY = 'celpip-custom-questions';

interface QuestionsData {
  task1: Task1Question[];
  task2: Task2Question[];
}

export default function AdminPanel() {
  const adminMode = useAppStore((state) => state.adminMode);
  const toggleAdminMode = useAppStore((state) => state.toggleAdminMode);
  const [activeTab, setActiveTab] = useState<'task1' | 'task2'>('task1');
  const [questionsData, setQuestionsData] = useState<QuestionsData>(() => {
    return loadFromStorage<QuestionsData>(CUSTOM_QUESTIONS_KEY, defaultQuestions as QuestionsData);
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state for adding/editing
  const [formTitle, setFormTitle] = useState('');
  const [formPrompt, setFormPrompt] = useState('');
  const [formSituation, setFormSituation] = useState('');
  const [formTone, setFormTone] = useState<'formal' | 'informal' | 'semi-formal'>('formal');
  const [formBulletPoints, setFormBulletPoints] = useState('');
  const [formTopic, setFormTopic] = useState('');
  const [formInstructions, setFormInstructions] = useState('');
  const [formViewpoints, setFormViewpoints] = useState('');

  useEffect(() => {
    saveToStorage(CUSTOM_QUESTIONS_KEY, questionsData);
  }, [questionsData]);

  if (!adminMode) {
    return (
      <section className="text-center py-12">
        <div className="text-4xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Panel
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Enable admin mode to manage questions.
        </p>
        <button
          onClick={toggleAdminMode}
          className="px-6 py-3 bg-celpip-blue hover:bg-celpip-lightblue text-white font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent focus:ring-offset-2"
        >
          Enable Admin Mode
        </button>
      </section>
    );
  }

  const currentQuestions = activeTab === 'task1' ? questionsData.task1 : questionsData.task2;

  const resetForm = () => {
    setFormTitle('');
    setFormPrompt('');
    setFormSituation('');
    setFormTone('formal');
    setFormBulletPoints('');
    setFormTopic('');
    setFormInstructions('');
    setFormViewpoints('');
    setEditingId(null);
    setShowAddForm(false);
  };

  const populateForm = (question: Task1Question | Task2Question) => {
    setFormTitle(question.title);
    setFormPrompt(question.prompt);
    if (question.type === 'task1') {
      const q = question as Task1Question;
      setFormSituation(q.situation);
      setFormTone(q.tone);
      setFormBulletPoints(q.bulletPoints.join('\n'));
    } else {
      const q = question as Task2Question;
      setFormTopic(q.topic);
      setFormInstructions(q.instructions);
      setFormViewpoints(q.viewpoints.join('\n'));
    }
    setEditingId(question.id);
    setShowAddForm(true);
  };

  const handleSaveQuestion = () => {
    if (!formTitle || !formPrompt) return;

    if (activeTab === 'task1') {
      const question: Task1Question = {
        id: editingId || `task1-${Date.now()}`,
        type: 'task1',
        title: formTitle,
        prompt: formPrompt,
        situation: formSituation,
        tone: formTone,
        bulletPoints: formBulletPoints.split('\n').filter((bp) => bp.trim()),
      };
      if (editingId) {
        setQuestionsData((prev) => ({
          ...prev,
          task1: prev.task1.map((q) => (q.id === editingId ? question : q)),
        }));
      } else {
        setQuestionsData((prev) => ({
          ...prev,
          task1: [...prev.task1, question],
        }));
      }
    } else {
      const question: Task2Question = {
        id: editingId || `task2-${Date.now()}`,
        type: 'task2',
        title: formTitle,
        prompt: formPrompt,
        topic: formTopic,
        instructions: formInstructions,
        viewpoints: formViewpoints.split('\n').filter((vp) => vp.trim()),
      };
      if (editingId) {
        setQuestionsData((prev) => ({
          ...prev,
          task2: prev.task2.map((q) => (q.id === editingId ? question : q)),
        }));
      } else {
        setQuestionsData((prev) => ({
          ...prev,
          task2: [...prev.task2, question],
        }));
      }
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (activeTab === 'task1') {
      setQuestionsData((prev) => ({
        ...prev,
        task1: prev.task1.filter((q) => q.id !== id),
      }));
    } else {
      setQuestionsData((prev) => ({
        ...prev,
        task2: prev.task2.filter((q) => q.id !== id),
      }));
    }
    setDeleteConfirm(null);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(questionsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'celpip-questions.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as QuestionsData;
        if (data.task1 && data.task2) {
          setQuestionsData(data);
        }
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Question Manager
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Add, edit, and manage practice questions.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent"
          >
            Export JSON
          </button>
          <label className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-celpip-accent">
            Import JSON
            <input type="file" accept=".json" onChange={handleImport} className="sr-only" />
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => { setActiveTab('task1'); resetForm(); }}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent ${
            activeTab === 'task1'
              ? 'bg-white dark:bg-gray-700 text-celpip-blue dark:text-celpip-accent shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Task 1 - Email ({questionsData.task1.length})
        </button>
        <button
          onClick={() => { setActiveTab('task2'); resetForm(); }}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent ${
            activeTab === 'task2'
              ? 'bg-white dark:bg-gray-700 text-celpip-blue dark:text-celpip-accent shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Task 2 - Survey ({questionsData.task2.length})
        </button>
      </div>

      {/* Add Question Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="mb-4 px-4 py-2 bg-celpip-blue hover:bg-celpip-lightblue text-white font-medium rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent focus:ring-offset-2"
        >
          + Add New Question
        </button>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border-2 border-celpip-accent">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            {editingId ? 'Edit Question' : 'Add New Question'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-celpip-accent"
                placeholder="Question title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prompt</label>
              <textarea
                value={formPrompt}
                onChange={(e) => setFormPrompt(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-y focus:outline-none focus:ring-2 focus:ring-celpip-accent"
                placeholder="Main prompt text"
              />
            </div>

            {activeTab === 'task1' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Situation</label>
                  <input
                    type="text"
                    value={formSituation}
                    onChange={(e) => setFormSituation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-celpip-accent"
                    placeholder="Describe the situation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tone</label>
                  <select
                    value={formTone}
                    onChange={(e) => setFormTone(e.target.value as 'formal' | 'informal' | 'semi-formal')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-celpip-accent"
                  >
                    <option value="formal">Formal</option>
                    <option value="semi-formal">Semi-formal</option>
                    <option value="informal">Informal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bullet Points (one per line)
                  </label>
                  <textarea
                    value={formBulletPoints}
                    onChange={(e) => setFormBulletPoints(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-y focus:outline-none focus:ring-2 focus:ring-celpip-accent"
                    placeholder="Point 1&#10;Point 2&#10;Point 3"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Topic</label>
                  <input
                    type="text"
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-celpip-accent"
                    placeholder="Survey topic"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instructions</label>
                  <textarea
                    value={formInstructions}
                    onChange={(e) => setFormInstructions(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-y focus:outline-none focus:ring-2 focus:ring-celpip-accent"
                    placeholder="Instructions for the response"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Viewpoints (one per line)
                  </label>
                  <textarea
                    value={formViewpoints}
                    onChange={(e) => setFormViewpoints(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-y focus:outline-none focus:ring-2 focus:ring-celpip-accent"
                    placeholder="Viewpoint 1&#10;Viewpoint 2&#10;Viewpoint 3"
                  />
                </div>
              </>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handleSaveQuestion}
                disabled={!formTitle || !formPrompt}
                className="px-4 py-2 bg-celpip-blue hover:bg-celpip-lightblue text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-celpip-accent focus:ring-offset-2"
              >
                {editingId ? 'Save Changes' : 'Add Question'}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question List */}
      <div className="space-y-3">
        {currentQuestions.map((question) => (
          <div key={question.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 overflow-hidden min-w-0">
            <div className="flex items-center justify-between min-w-0">
              <div className="flex-1 mr-4 min-w-0 overflow-hidden">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                  {question.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                  {question.prompt}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => populateForm(question as Task1Question | Task2Question)}
                  className="p-2 text-celpip-blue dark:text-celpip-accent hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent"
                  aria-label="Edit question"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                {deleteConfirm === question.id ? (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(question.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Delete question"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
