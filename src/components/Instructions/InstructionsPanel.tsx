import { useState } from 'react';

interface InstructionsPanelProps {
  taskType: 'task1' | 'task2';
}

export default function InstructionsPanel({ taskType }: InstructionsPanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-celpip-accent hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
        aria-expanded={expanded}
      >
        <span className="font-medium text-gray-900 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-celpip-accent" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Writing Tips & Scoring Criteria
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
          {taskType === 'task1' ? (
            <>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                  Task 1 - Email Writing Tips
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Use an appropriate greeting and closing based on the required tone</li>
                  <li>Address ALL bullet points provided in the prompt</li>
                  <li>Match the tone (formal, informal, or semi-formal) throughout</li>
                  <li>Use clear paragraph structure with a logical flow</li>
                  <li>Aim for 150-200 words to fully develop your ideas</li>
                  <li>Use transition words to connect your ideas smoothly</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                  Email Format Guide
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Formal: &quot;Dear Mr./Ms. [Name],&quot; - &quot;Sincerely,&quot;</li>
                  <li>Semi-formal: &quot;Dear [First Name],&quot; - &quot;Best regards,&quot;</li>
                  <li>Informal: &quot;Hi [Name],&quot; - &quot;Cheers,&quot; or &quot;Talk soon,&quot;</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                  Paragraph-by-Paragraph Structure
                </h4>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Opening Paragraph</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Start with an appropriate greeting that matches the tone</li>
                      <li>State your purpose clearly in the first sentence after the greeting</li>
                      <li>Establish context (who you are, why you are writing)</li>
                      <li>Formal: &quot;I am writing to you regarding...&quot; / &quot;I am writing to express...&quot;</li>
                      <li>Semi-formal: &quot;I wanted to reach out about...&quot;</li>
                      <li>Informal: &quot;I just wanted to let you know...&quot;</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Body Paragraphs</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Address each bullet point in its own paragraph or logical group</li>
                      <li>Use specific details and examples to support each point</li>
                      <li>Use transition phrases between points: &quot;In addition,&quot; &quot;Furthermore,&quot; &quot;As you know,&quot;</li>
                      <li>Use conditionals for suggestions: &quot;If you could...&quot; / &quot;It would be great if...&quot;</li>
                      <li>Use past tense for descriptions: &quot;I recently noticed...&quot; / &quot;Last week, I experienced...&quot;</li>
                      <li>Keep each paragraph focused on one main idea with supporting detail</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Closing Paragraph</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Summarize your main request or purpose briefly</li>
                      <li>Include a call to action: what you want the reader to do next</li>
                      <li>Use an appropriate sign-off that matches the tone throughout</li>
                      <li>Formal: &quot;I would appreciate your prompt attention to this matter.&quot;</li>
                      <li>Semi-formal: &quot;I hope to hear from you soon.&quot;</li>
                      <li>Informal: &quot;Let me know what you think!&quot;</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                  Grammar and Style Tips (Level 9+ Strategies)
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Formal requests: &quot;I would appreciate...&quot; / &quot;Could you please...&quot; / &quot;I would be grateful if...&quot;</li>
                  <li>Purpose statements: &quot;I am writing to inform you...&quot; / &quot;I am writing with regards to...&quot;</li>
                  <li>Polite modals: &quot;Would it be possible to...&quot; / &quot;I was wondering if...&quot;</li>
                  <li>Hedging language: &quot;I feel that...&quot; / &quot;It seems to me that...&quot; / &quot;Perhaps we could...&quot;</li>
                  <li>Use varied vocabulary instead of repeating words (e.g., &quot;facility&quot; instead of repeating &quot;library&quot;)</li>
                  <li>Connect ideas with conjunctions: &quot;as such,&quot; &quot;given that,&quot; &quot;as a result,&quot; &quot;therefore&quot;</li>
                  <li>Use subjunctive/conditional for higher scores: &quot;If it were possible...&quot; / &quot;I would suggest that...&quot;</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                  Task 2 - Survey Response Tips
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Clearly state your opinion or preference in the opening</li>
                  <li>Provide at least two supporting reasons with examples</li>
                  <li>Consider and address the alternative viewpoints</li>
                  <li>Use specific examples from personal experience or general knowledge</li>
                  <li>Aim for 150-200 words to fully develop your argument</li>
                  <li>End with a concluding statement that reinforces your position</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                  Paragraph-by-Paragraph Structure
                </h4>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Opening Paragraph</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>State your opinion clearly and directly in the first sentence</li>
                      <li>Use a hook or context statement to engage the reader</li>
                      <li>Structure as: opinion + preview of reasons (thesis)</li>
                      <li>Example: &quot;I would prefer [option] for two primary reasons: [reason 1] and [reason 2].&quot;</li>
                      <li>Avoid vague openings; be specific from the start</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Body Paragraphs (2-3 paragraphs)</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Structure each reason: topic sentence &gt; explanation &gt; specific example/evidence</li>
                      <li>Use comparative language when discussing options: &quot;as opposed to,&quot; &quot;outweighs,&quot; &quot;more appealing&quot;</li>
                      <li>Include personal details or factual support for each point</li>
                      <li>Transition words between paragraphs: &quot;Furthermore,&quot; &quot;Additionally,&quot; &quot;Moreover,&quot; &quot;On the other hand&quot;</li>
                      <li>Keep each paragraph focused on one reason with concrete supporting detail</li>
                      <li>Address the alternative briefly: &quot;While some may prefer..., I believe...&quot;</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Closing Paragraph</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Restate your position without simply repeating your opening</li>
                      <li>Add a broader implication or forward-looking statement</li>
                      <li>End with a strong concluding sentence that leaves an impression</li>
                      <li>Example: &quot;For these reasons, I firmly believe [option] is the more beneficial choice for our community.&quot;</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                  Grammar and Style Tips (Level 9+ Strategies)
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Opinion expressions: &quot;I firmly believe,&quot; &quot;In my view,&quot; &quot;I am convinced that,&quot; &quot;It is my strong opinion that&quot;</li>
                  <li>Comparative structures: &quot;far more beneficial than...,&quot; &quot;significantly outweighs...,&quot; &quot;all the more appealing&quot;</li>
                  <li>Conditional reasoning: &quot;If X were implemented, Y would...,&quot; &quot;Were the government to..., it would...&quot;</li>
                  <li>Cause-effect language: &quot;As a result,&quot; &quot;This in turn would...,&quot; &quot;Consequently,&quot; &quot;Thus&quot;</li>
                  <li>Use precise vocabulary: &quot;at my own discretion,&quot; &quot;the onus would be on...,&quot; &quot;realistically&quot;</li>
                  <li>Varied sentence structure: mix simple, compound, and complex sentences</li>
                  <li>Use relative clauses for detail: &quot;which has resulted in...,&quot; &quot;where I have observed...&quot;</li>
                </ul>
              </div>
            </>
          )}

          {/* Scoring Criteria */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
              CELPIP Scoring Criteria
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                <p className="font-medium text-gray-800 dark:text-gray-200">Content/Coherence</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ideas, organization, and logical flow</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                <p className="font-medium text-gray-800 dark:text-gray-200">Vocabulary</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Range and accuracy of word choice</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                <p className="font-medium text-gray-800 dark:text-gray-200">Readability</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Grammar, spelling, and punctuation control</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                <p className="font-medium text-gray-800 dark:text-gray-200">Task Fulfillment</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Tone, style, and addressing the prompt requirements</p>
              </div>
            </div>
          </div>

          {/* Score Thresholds Reference */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
              Key Score Thresholds
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-l-blue-500 rounded p-2">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">CELPIP 7+ (CLB 7) - Express Entry</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Required for Federal Skilled Worker Program</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border-l-4 border-l-green-500 rounded p-2">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">CELPIP 5-7 (CLB 5-7) - Provincial Nominees</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Varies by province and stream</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 border-l-4 border-l-amber-500 rounded p-2">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">CELPIP 4+ (CLB 4) - Citizenship</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Minimum for Canadian citizenship application</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
