"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Screen } from "@/components/screen"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

type QuestionType =
  | "welcome"
  | "radio"
  | "scale"
  | "completion"
  | "section-intro"
  | "test-intro"
  | "test-question"
  | "dashboard"
  | "text-input"

interface Question {
  id: number
  type: QuestionType
  title: string
  description?: string
  options?: string[]
  scaleLabels?: { min: string; max: string }
  section?: number
  testType?: "numerical" | "verbal" | "logical"
  correctAnswer?: string
  timeLimit?: number
}

const questions: Question[] = [
  {
    id: 0,
    type: "welcome",
    title: "Let's get to know you a little better.",
    description: "Answer a few short questions so we can understand your current situation.",
  },
  {
    id: 1, // New unique ID for age
    type: "text-input",
    title: "How old are you?",
    section: 1,
  },
  {
    id: 2, // Previously 1
    type: "radio",
    title: "What's the highest level of education you've completed?",
    options: ["No formal education", "Secondary", "College", "University", "Postgraduate", "Other"],
    section: 1,
  },
  {
    id: 3, // Previously 2
    type: "scale",
    title: "How comfortable do you feel reading or writing complex text, like forms or instructions?",
    scaleLabels: { min: "Not confident", max: "Very confident" },
    section: 1,
  },
  {
    id: 4, // Previously 3
    type: "radio",
    title: "How would you describe your current financial situation?",
    options: ["Struggling", "Managing", "Comfortable", "Prefer not to say"],
    section: 1,
  },
  {
    id: 5, // Previously 4
    type: "scale",
    title: "Do you have people or communities you can rely on for help or advice?",
    scaleLabels: { min: "None", max: "Strong network" },
    section: 1,
  },
  {
    id: 6, // Previously 5
    type: "scale",
    title: "How would you describe your emotional wellbeing recently?",
    scaleLabels: { min: "Struggling", max: "Thriving" },
    section: 1,
  },
  {
    id: 7, // Previously 6
    type: "text-input",
    title: "Where are you based location-wise?",
    section: 1,
  },
  {
    id: 8, // Previously 7
    type: "text-input",
    title: "What do you want to be?",
    section: 1,
  },
  // Adjust IDs for subsequent questions
  {
    id: 9, // Previously 8
    type: "completion",
    title: "Thank you for sharing.",
    description: "This helps us understand where you're starting from.",
    section: 1,
  },
  {
    id: 10, // Previously 9
    type: "section-intro",
    title: "Psychometric Testing",
    description: "Are you ready to proceed with the psychometric testing section?",
    section: 2,
  },
  // Numerical Reasoning Test
  {
    id: 11, // Previously 10
    type: "test-intro",
    title: "Numerical Reasoning Test",
    description: "You will have 3 minutes to answer 5 questions. The test will begin when you click Start Test.",
    section: 2,
    testType: "numerical",
    timeLimit: 180,
  },
  {
    id: 12, // Previously 11
    type: "test-question",
    title: "If a shirt costs £45 and is reduced by 20%, what is the new price?",
    options: ["£36", "£40", "£35", "£38"],
    correctAnswer: "£36",
    section: 2,
    testType: "numerical",
  },
  {
    id: 13, // Previously 12
    type: "test-question",
    title: "A car travels 240 miles in 4 hours. What is its average speed in miles per hour?",
    options: ["50 mph", "60 mph", "70 mph", "80 mph"],
    correctAnswer: "60 mph",
    section: 2,
    testType: "numerical",
  },
  {
    id: 14, // Previously 13
    type: "test-question",
    title: "If 3x + 7 = 22, what is the value of x?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "5",
    section: 2,
    testType: "numerical",
  },
  {
    id: 15, // Previously 14
    type: "test-question",
    title: "A rectangle has a length of 12cm and width of 8cm. What is its area?",
    options: ["40cm²", "96cm²", "20cm²", "48cm²"],
    correctAnswer: "96cm²",
    section: 2,
    testType: "numerical",
  },
  {
    id: 16, // Previously 15
    type: "test-question",
    title: "If 60% of students passed an exam and 24 students passed, how many students took the exam?",
    options: ["30", "35", "40", "45"],
    correctAnswer: "40",
    section: 2,
    testType: "numerical",
  },
  // Verbal Reasoning Test
  {
    id: 17, // Previously 16
    type: "test-intro",
    title: "Verbal Reasoning Test",
    description: "You will have 3 minutes to answer 5 questions. The test will begin when you click Start Test.",
    section: 2,
    testType: "verbal",
    timeLimit: 180,
  },
  {
    id: 18, // Previously 17
    type: "test-question",
    title: "Which word is the odd one out: Apple, Banana, Carrot, Orange",
    options: ["Apple", "Banana", "Carrot", "Orange"],
    correctAnswer: "Carrot",
    section: 2,
    testType: "verbal",
  },
  {
    id: 19, // Previously 18
    type: "test-question",
    title: "Complete the analogy: Hot is to Cold as Day is to ___",
    options: ["Sun", "Night", "Moon", "Light"],
    correctAnswer: "Night",
    section: 2,
    testType: "verbal",
  },
  {
    id: 20, // Previously 19
    type: "test-question",
    title: "Which word means the opposite of 'abundant'?",
    options: ["Scarce", "Plentiful", "Ample", "Rich"],
    correctAnswer: "Scarce",
    section: 2,
    testType: "verbal",
  },
  {
    id: 21, // Previously 20
    type: "test-question",
    title: "If all roses are flowers and some flowers fade quickly, can we conclude that some roses fade quickly?",
    options: ["True", "False", "Cannot determine"],
    correctAnswer: "Cannot determine",
    section: 2,
    testType: "verbal",
  },
  {
    id: 22, // Previously 21
    type: "test-question",
    title: "Which word best completes: 'The scientist's research was ___ and groundbreaking'?",
    options: ["Trivial", "Profound", "Commonplace", "Unoriginal"],
    correctAnswer: "Profound",
    section: 2,
    testType: "verbal",
  },
  // Logical Reasoning Test
  {
    id: 23, // Previously 22
    type: "test-intro",
    title: "Logical Reasoning Test",
    description: "You will have 3 minutes to answer 5 questions. The test will begin when you click Start Test.",
    section: 2,
    testType: "logical",
    timeLimit: 180,
  },
  {
    id: 24, // Previously 23
    type: "test-question",
    title: "What comes next in the sequence: 2, 4, 8, 16, ___?",
    options: ["20", "24", "32", "36"],
    correctAnswer: "32",
    section: 2,
    testType: "logical",
  },
  {
    id: 25, // Previously 24
    type: "test-question",
    title: "If all A are B, and all B are C, then:",
    options: ["All A are C", "Some A are not C", "No A are C", "All C are A"],
    correctAnswer: "All A are C",
    section: 2,
    testType: "logical",
  },
  {
    id: 26, // Previously 25
    type: "test-question",
    title: "Complete the pattern: O, T, T, F, F, S, S, ___?",
    options: ["E", "N", "T", "O"],
    correctAnswer: "E",
    section: 2,
    testType: "logical",
  },
  {
    id: 27, // Previously 26
    type: "test-question",
    title: "A is taller than B. B is taller than C. Who is the shortest?",
    options: ["A", "B", "C", "Cannot determine"],
    correctAnswer: "C",
    section: 2,
    testType: "logical",
  },
  {
    id: 28, // Previously 27
    type: "test-question",
    title: "If today is Wednesday, what day will it be in 100 days?",
    options: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    correctAnswer: "Thursday",
    section: 2,
    testType: "logical",
  },
  {
    id: 29, // Previously 28
    type: "completion",
    title: "Testing Complete!",
    description: "You've finished all three psychometric tests. Thank you for your participation.",
    section: 2,
  },
  {
    id: 30, // Previously 29
    type: "dashboard",
    title: "Your Results Dashboard",
    description: "Here's a summary of your responses and test performance.",
  },
]

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string | number>>({})
  const [direction, setDirection] = useState(0)
  const [testStarted, setTestStarted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [testScore, setTestScore] = useState<Record<string, { correct: number; total: number }>>({})
  const [currentTestType, setCurrentTestType] = useState<string | null>(null)
  const [gptAnalysis, setGptAnalysis] = useState<string | null>(null); // New state for GPT analysis
  const [loadingAnalysis, setLoadingAnalysis] = useState(false); // New state for loading indicator
  const { toast } = useToast(); // Add this line to destructure toast

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && currentSlide < questions.length - 1) {
        handleNext()
      } else if (e.key === "ArrowLeft" && currentSlide > 0) {
        handleBack()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentSlide])

  useEffect(() => {
    if (testStarted && timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            setTestStarted(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [testStarted, timeRemaining])

  // New useEffect to trigger GPT analysis when dashboard is reached
  useEffect(() => {
    const currentQuestion = questions[currentSlide];
    if (currentQuestion.type === "dashboard" && !gptAnalysis && !loadingAnalysis) {
      const generateAnalysis = async () => {
        setLoadingAnalysis(true);
        try {
          const response = await fetch('/api/analyze-goals', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ answers, questions }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setGptAnalysis(data.analysis);
        } catch (error) {
          console.error("Failed to fetch GPT analysis:", error);
          // Assuming `useToast` is imported and available
          toast({
            title: "Error",
            description: "Failed to generate AI analysis. Please try again later.",
            variant: "destructive",
          });
        } finally {
          setLoadingAnalysis(false);
        }
      };
      generateAnalysis();
    }
  }, [currentSlide, gptAnalysis, loadingAnalysis, answers, questions, toast]); // Include toast in dependencies

  const handleNext = () => {
    if (currentSlide < questions.length - 1) {
      setDirection(1)
      setCurrentSlide(currentSlide + 1)

      const nextQuestion = questions[currentSlide + 1]
      if (nextQuestion.type !== "test-question") {
        setTestStarted(false)
        setTimeRemaining(null)
        setCurrentTestType(null)
      }
    }
  }

  const handleBack = () => {
    if (currentSlide > 0) {
      setDirection(-1)
      setCurrentSlide(currentSlide - 1)
      // Clear analysis if navigating back from dashboard
      if (questions[currentSlide]?.type === "dashboard") { // Check current slide type before moving back
        setGptAnalysis(null);
      }
    }
  }

  const handleAnswer = (answer: string | number) => {
    setAnswers({ ...answers, [currentSlide]: answer })
  }

  const handleStartTest = () => {
    const currentQuestion = questions[currentSlide]
    if (currentQuestion.timeLimit && currentQuestion.testType) {
      setTimeRemaining(currentQuestion.timeLimit)
      setTestStarted(true)
      setCurrentTestType(currentQuestion.testType)
      handleNext()
    }
  }

  const isCurrentTestComplete = () => {
    if (!currentTestType) return false
    const testQuestions = questions.filter((q) => q.type === "test-question" && q.testType === currentTestType)
    return testQuestions.every((q) => answers[q.id] !== undefined)
  }

  const isLastTestQuestion = () => {
    if (questions[currentSlide].type !== "test-question" || !questions[currentSlide].testType) return false
    const testQuestions = questions.filter(
      (q) => q.type === "test-question" && q.testType === questions[currentSlide].testType,
    )
    const lastTestQuestion = testQuestions[testQuestions.length - 1]
    return questions[currentSlide].id === lastTestQuestion.id
  }

  const handleTestNext = () => {
    if (isLastTestQuestion() && currentTestType) {
      const testQuestions = questions.filter((q) => q.type === "test-question" && q.testType === currentTestType)
      let correct = 0
      testQuestions.forEach((q) => {
        if (answers[q.id] === q.correctAnswer) {
          correct++
        }
      })

      setTestScore({
        ...testScore,
        [currentTestType]: { correct, total: testQuestions.length },
      })

      setTestStarted(false)
      setTimeRemaining(null)
      setCurrentTestType(null)
    }
    handleNext()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const currentQuestion = questions[currentSlide]

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  }

  const isCentered =
    currentQuestion.type === "welcome" ||
    currentQuestion.type === "completion" ||
    currentQuestion.type === "section-intro" ||
    currentQuestion.type === "test-intro" ||
    currentQuestion.type === "dashboard"

  const isInTest = testStarted && currentQuestion.type === "test-question"

  return (
    <div className="h-screen bg-[#F8FAFC] relative overflow-hidden">
      <Screen>
        {isCentered ? (
          <>
            <main className={`h-full flex p-8 bg-[#F8FAFC] overflow-y-auto ${currentQuestion.type === "dashboard" ? "flex-col justify-start items-center" : "items-center justify-center"}`}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentSlide}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="w-full max-w-4xl"
                >
                  {currentQuestion.type === "dashboard" ? (
                    <div className="space-y-10">
                      <div className="text-center space-y-4">
                        <h1 className="font-serif text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight">
                          {currentQuestion.title}
                        </h1>
                        <p className="font-serif text-sm lg:text-base text-gray-600">
                          {currentQuestion.description}
                        </p>
                      </div>

                      {/* GPT Analysis Section */}
                      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 space-y-6">
                        <h2 className="font-serif text-xl font-bold text-gray-900 border-b pb-3">
                          AI-Powered Goal Analysis
                        </h2>
                        {loadingAnalysis ? (
                          <p className="font-serif text-gray-700">Generating analysis...</p>
                        ) : gptAnalysis ? (
                          <div className="prose max-w-none">
                            <p className="font-serif text-gray-700 whitespace-pre-line">{gptAnalysis}</p>
                          </div>
                        ) : (
                          <p className="font-serif text-gray-700">Analysis not available.</p>
                        )}
                      </div>

                      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 space-y-6">
                        <h2 className="font-serif text-xl font-bold text-gray-900 border-b pb-3">
                          Personal Background
                        </h2>
                        <div className="grid gap-6">
                          {/* Display new age answer */}
                          <div className="flex justify-between items-start">
                            <span className="font-serif text-sm text-gray-600">Age</span>
                            <span className="font-serif text-sm font-semibold text-gray-900 text-right max-w-xs">
                              {answers[1] || "Not answered"}
                            </span>
                          </div>

                          <div className="flex justify-between items-start">
                            <span className="font-serif text-sm text-gray-600">Education Level</span>
                            <span className="font-serif text-sm font-semibold text-gray-900 text-right max-w-xs">
                              {answers[2] || "Not answered"}
                            </span>
                          </div>

                          <div className="flex justify-between items-start">
                            <span className="font-serif text-sm text-gray-600">Reading/Writing Confidence</span>
                            <span className="font-serif text-sm font-semibold text-gray-900">
                              {answers[3] ? `${answers[3]}/5` : "Not answered"}
                            </span>
                          </div>

                          <div className="flex justify-between items-start">
                            <span className="font-serif text-sm text-gray-600">Financial Situation</span>
                            <span className="font-serif text-sm font-semibold text-gray-900 text-right max-w-xs">
                              {answers[4] || "Not answered"}
                            </span>
                          </div>

                          <div className="flex justify-between items-start">
                            <span className="font-serif text-sm text-gray-600">Support Network</span>
                            <span className="font-serif text-sm font-semibold text-gray-900">
                              {answers[5] ? `${answers[5]}/5` : "Not answered"}
                            </span>
                          </div>

                          <div className="flex justify-between items-start">
                            <span className="font-serif text-sm text-gray-600">Emotional Wellbeing</span>
                            <span className="font-serif text-sm font-semibold text-gray-900">
                              {answers[6] ? `${answers[6]}/5` : "Not answered"}
                            </span>
                          </div>

                          <div className="flex justify-between items-start">
                            <span className="font-serif text-sm text-gray-600">Location</span>
                            <span className="font-serif text-sm font-semibold text-gray-900 text-right max-w-xs">
                              {answers[7] || "Not answered"}
                            </span>
                          </div>
                          <div className="flex justify-between items-start">
                            <span className="font-serif text-sm text-gray-600">Aspiration</span>
                            <span className="font-serif text-sm font-semibold text-gray-900 text-right max-w-xs">
                              {answers[8] || "Not answered"}
                            </span>
                          </div>

                        </div>
                      </div>

                      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 space-y-6">
                        <h2 className="font-serif text-xl font-bold text-gray-900 border-b pb-3">
                          Psychometric Test Results
                        </h2>

                        <div className="grid gap-6">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-serif text-sm text-gray-600">Numerical Reasoning</span>
                              <span className="font-serif text-sm font-semibold text-gray-900">
                                {testScore.numerical
                                  ? `${testScore.numerical.correct}/${testScore.numerical.total}`
                                  : "Not completed"}
                              </span>
                            </div>
                            {testScore.numerical && (
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-black h-2 rounded-full transition-all"
                                  style={{
                                    width: `${(testScore.numerical.correct / testScore.numerical.total) * 100}%`,
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-serif text-sm text-gray-600">Verbal Reasoning</span>
                              <span className="font-serif text-sm font-semibold text-gray-900">
                                {testScore.verbal
                                  ? `${testScore.verbal.correct}/${testScore.verbal.total}`
                                  : "Not completed"}
                              </span>
                            </div>
                            {testScore.verbal && (
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-black h-2 rounded-full transition-all"
                                  style={{
                                    width: `${(testScore.verbal.correct / testScore.verbal.total) * 100}%`,
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-serif text-sm text-gray-600">Logical Reasoning</span>
                              <span className="font-serif text-sm font-semibold text-gray-900">
                                {testScore.logical
                                  ? `${testScore.logical.correct}/${testScore.logical.total}`
                                  : "Not completed"}
                              </span>
                            </div>
                            {testScore.logical && (
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-black h-2 rounded-full transition-all"
                                  style={{
                                    width: `${(testScore.logical.correct / testScore.logical.total) * 100}%`,
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          {testScore.numerical && testScore.verbal && testScore.logical && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex justify-between items-center">
                                <span className="font-serif text-base font-bold text-gray-900">Overall Score</span>
                                <span className="font-serif text-base font-bold text-gray-900">
                                  {testScore.numerical.correct + testScore.verbal.correct + testScore.logical.correct}/
                                  {testScore.numerical.total + testScore.verbal.total + testScore.logical.total}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-center pt-4">
                        <button
                          onClick={handleBack}
                          className="px-8 py-4 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold font-serif text-base transition-colors"
                        >
                          Back to Results
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-8">
                      <h1 className="font-serif text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 leading-tight text-balance">
                        {currentQuestion.title}
                      </h1>
                      {currentQuestion.description && (
                        <p className="font-serif text-sm lg:text-base text-gray-600 leading-relaxed">
                          {currentQuestion.description}
                        </p>
                      )}

                      {currentQuestion.type === "test-intro" &&
                        currentQuestion.testType &&
                        testScore[currentQuestion.testType] && (
                          <div className="p-6 bg-black/5 rounded-xl">
                            <p className="font-serif text-base text-gray-900 font-semibold">
                              Previous Score: {testScore[currentQuestion.testType].correct} /{" "}
                              {testScore[currentQuestion.testType].total}
                            </p>
                          </div>
                        )}

                      {currentQuestion.type === "welcome" && (
                        <button
                          onClick={handleNext}
                          className="px-8 py-4 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold font-serif text-base transition-colors"
                        >
                          Start
                        </button>
                      )}

                      {currentQuestion.type === "section-intro" && (
                        <button
                          onClick={handleNext}
                          className="px-8 py-4 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold font-serif text-base transition-colors"
                        >
                          Continue
                        </button>
                      )}

                      {currentQuestion.type === "test-intro" && (
                        <button
                          onClick={handleStartTest}
                          className="px-8 py-4 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold font-serif text-base transition-colors"
                        >
                          Start Test
                        </button>
                      )}

                      {currentQuestion.type === "completion" && (
                        <button
                          onClick={handleNext}
                          disabled={currentSlide === questions.length - 1}
                          className="px-8 py-4 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold font-serif text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Continue to Next Section
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </main>
          </>
        ) : (
          <>
            <header className="flex h-16 items-center justify-end border-b border-gray-200 px-6 bg-[#F8FAFC]">
              {isInTest && timeRemaining !== null && (
                <span className="font-serif text-sm font-semibold text-black mr-4">
                  Time: {formatTime(timeRemaining)}
                </span>
              )}
            </header>

            <main className="flex-1 flex bg-[#F8FAFC]">
              <div className="w-full lg:w-[60%] flex flex-col justify-between p-8 lg:p-12">
                <div className="flex-1 flex items-center">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={currentSlide}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="w-full max-w-2xl"
                    >
                      <div className="space-y-8">
                        <h1 className="font-serif text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 leading-tight text-balance">
                          {currentQuestion.title}
                        </h1>
                        {currentQuestion.description && (
                          <p className="font-serif text-sm lg:text-base text-gray-600 leading-relaxed">
                            {currentQuestion.description}
                          </p>
                        )}

                        {currentQuestion.type === "radio" && currentQuestion.options && (
                          <div className="space-y-3 pt-4">
                            {currentQuestion.options.map((option) => (
                              <button
                                key={option}
                                onClick={() => handleAnswer(option)}
                                className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all ${
                                  answers[currentSlide] === option
                                    ? "border-black bg-black/5"
                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                }`}
                              >
                                <span className="font-serif text-sm font-medium text-gray-900">{option}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {currentQuestion.type === "text-input" && (
                          <div className="pt-4">
                            <input
                              type="text"
                              className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none"
                              placeholder="Type your answer here..."
                              value={answers[currentSlide] || ""}
                              onChange={(e) => handleAnswer(e.target.value)}
                            />
                          </div>
                        )}
                        {currentQuestion.type === "test-question" && currentQuestion.options && (
                          <div className="space-y-3 pt-4">
                            {currentQuestion.options.map((option) => (
                              <button
                                key={option}
                                onClick={() => handleAnswer(option)}
                                className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all ${
                                  answers[currentSlide] === option
                                    ? "border-black bg-black/5"
                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                }`}
                              >
                                <span className="font-serif text-sm font-medium text-gray-900">{option}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {currentQuestion.type === "scale" && currentQuestion.scaleLabels && (
                          <div className="space-y-6 pt-4">
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                  key={value}
                                  onClick={() => handleAnswer(value)}
                                  className={`flex-1 h-12 rounded-xl border-2 transition-all font-semibold font-serif text-sm ${
                                    answers[currentSlide] === value
                                      ? "border-black bg-black text-white"
                                      : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                                  }`}
                                >
                                  {value}
                                </button>
                              ))}
                            </div>
                            <div className="flex justify-between text-xs font-serif text-gray-500">
                              <span>{currentQuestion.scaleLabels.min}</span>
                              <span>{currentQuestion.scaleLabels.max}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-4 pt-8">
                  <button
                    onClick={handleBack}
                    disabled={currentSlide === 0 || isInTest}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 font-medium font-serif text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleTestNext}
                    disabled={currentSlide === questions.length - 1 || !answers[currentSlide]}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-black hover:bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium font-serif text-sm"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="hidden lg:block w-[40%] bg-[#F8FAFC]" />
            </main>
          </>
        )}
      </Screen>
    </div>
  )
}
