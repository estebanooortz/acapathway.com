"use client"

import { useState, useEffect } from "react"
import { BadgeCheck, CircleAlert, Clock, Loader2 } from "lucide-react"

const US_STATES: Record<string, string> = {
  "35": "Alabama", "99": "Alaska", "85": "Arizona", "71": "Arkansas", "90": "California",
  "80": "Colorado", "06": "Connecticut", "19": "Delaware", "32": "Florida", "30": "Georgia",
  "96": "Hawaii", "83": "Idaho", "60": "Illinois", "46": "Indiana", "50": "Iowa",
  "66": "Kansas", "40": "Kentucky", "70": "Louisiana", "03": "Maine", "20": "Maryland",
  "01": "Massachusetts", "48": "Michigan", "55": "Minnesota", "38": "Mississippi",
  "63": "Missouri", "59": "Montana", "68": "Nebraska", "88": "Nevada", "03": "New Hampshire",
  "07": "New Jersey", "87": "New Mexico", "10": "New York", "27": "North Carolina",
  "58": "North Dakota", "43": "Ohio", "73": "Oklahoma", "97": "Oregon", "15": "Pennsylvania",
  "02": "Rhode Island", "29": "South Carolina", "57": "South Dakota", "37": "Tennessee",
  "75": "Texas", "84": "Utah", "05": "Vermont", "22": "Virginia", "98": "Washington",
  "24": "West Virginia", "53": "Wisconsin", "82": "Wyoming"
}

function getStateFromZip(zip: string): string | null {
  const prefix = zip.substring(0, 2)
  return US_STATES[prefix] || null
}

function isValidUSZip(zip: string): boolean {
  return /^\d{5}$/.test(zip) && getStateFromZip(zip) !== null
}

interface ProgressBarProps {
  progress: number
}

function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full h-1 bg-gray-200">
      <div
        className="h-full bg-red-600 transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

function LoadingSpinner({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      <p className="text-gray-600 text-sm font-medium animate-pulse">{message}</p>
    </div>
  )
}

function InitialPreloader() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-red-600">
        <div className="px-6 py-8 text-center space-y-4">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
            Official Notice
          </h2>
          
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-red-600 uppercase tracking-wide">
              Federal Dividend Refund Audit
            </h1>
            <p className="text-base font-semibold text-gray-800">
              RECOVERY CREDIT QUESTIONNAIRE
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 py-4">
            <Loader2 className="w-5 h-5 text-red-600 animate-spin" />
            <span className="text-gray-600 text-sm">Initializing secure session...</span>
          </div>
        </div>

        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500 uppercase tracking-wider">
            Secure Verification System • Confidential • 2026
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FederalDividendForm() {
  const [isInitializing, setIsInitializing] = useState(true)
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  
  // Form data
  const [claimAnswer, setClaimAnswer] = useState<string | null>(null)
  const [zipCode, setZipCode] = useState("")
  const [zipError, setZipError] = useState("")
  const [detectedState, setDetectedState] = useState<string | null>(null)
  const [age, setAge] = useState("")
  const [income, setIncome] = useState("")
  
  // Results animation
  const [displayAmount, setDisplayAmount] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const progress = step === 1 ? 25 : step === 2 ? 50 : step === 3 ? 75 : 100

  // Initial preloader effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  if (isInitializing) {
    return <InitialPreloader />
  }

  const handleTransition = (nextStep: number, message: string, delay: number = 2000) => {
    setIsLoading(true)
    setLoadingMessage(message)
    setTimeout(() => {
      setIsLoading(false)
      setStep(nextStep)
    }, delay)
  }

  const handleClaimAnswer = (answer: string) => {
    setClaimAnswer(answer)
    handleTransition(2, "Verifying eligibility...")
  }

  const handleZipSubmit = () => {
    if (!isValidUSZip(zipCode)) {
      setZipError("Please enter a valid 5-digit US ZIP code")
      return
    }
    setZipError("")
    const state = getStateFromZip(zipCode)
    setDetectedState(state)
    handleTransition(3, `Checking ${state} database...`)
  }

  const handleZipChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 5)
    setZipCode(cleaned)
    setZipError("")
    if (cleaned.length === 5) {
      const state = getStateFromZip(cleaned)
      setDetectedState(state)
    } else {
      setDetectedState(null)
    }
  }

  const handleDetailsSubmit = () => {
    if (!age || !income) return
    handleTransition(4, "Processing your information...", 2500)
  }

  // Animate the dollar amount on results screen
  useEffect(() => {
    if (step === 4 && !showResults) {
      setShowResults(true)
      const target = 2000
      const duration = 1500
      const steps = 60
      const increment = target / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          setDisplayAmount(target)
          clearInterval(timer)
        } else {
          setDisplayAmount(Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [step, showResults])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <ProgressBar progress={progress} />
      
      <div className="flex-1 flex items-start justify-center p-4 pt-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-red-600">
          {/* Header */}
          <div className="bg-gray-900 text-white px-4 py-3">
            <div className="flex items-center gap-2">
              <CircleAlert className="w-5 h-5 text-red-500" />
              <span className="text-sm font-semibold uppercase tracking-wide">
                Official Notice
              </span>
            </div>
            <h1 className="text-lg font-bold mt-1">
              Federal Dividend Refund Audit
            </h1>
          </div>

          {/* Content */}
          <div className="p-5">
            {isLoading ? (
              <LoadingSpinner message={loadingMessage} />
            ) : step === 1 ? (
              <Step1 onAnswer={handleClaimAnswer} />
            ) : step === 2 ? (
              <Step2
                zipCode={zipCode}
                zipError={zipError}
                detectedState={detectedState}
                onChange={handleZipChange}
                onSubmit={handleZipSubmit}
              />
            ) : step === 3 ? (
              <Step3
                age={age}
                income={income}
                detectedState={detectedState}
                onAgeChange={setAge}
                onIncomeChange={setIncome}
                onSubmit={handleDetailsSubmit}
              />
            ) : (
              <Results displayAmount={displayAmount} detectedState={detectedState} />
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Processing time: 2-3 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Step1({ onAnswer }: { onAnswer: (answer: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-red-600 font-bold text-sm">1</span>
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 text-base">
            Have you already claimed your $2,000 Federal Dividend Refund Credits?
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Most Americans have not claimed their eligible credits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        {["Yes", "No", "Not Sure"].map((answer) => (
          <button
            key={answer}
            onClick={() => onAnswer(answer)}
            className="py-3 px-4 bg-white border-2 border-gray-200 rounded-lg text-gray-900 font-medium text-sm hover:border-red-600 hover:bg-red-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  )
}

interface Step2Props {
  zipCode: string
  zipError: string
  detectedState: string | null
  onChange: (value: string) => void
  onSubmit: () => void
}

function Step2({ zipCode, zipError, detectedState, onChange, onSubmit }: Step2Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-red-600 font-bold text-sm">2</span>
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 text-base">
            Enter your ZIP Code
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            We need to verify your state eligibility.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter 5-digit ZIP code"
            value={zipCode}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-lg text-center text-lg font-medium tracking-widest focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-colors ${
              zipError ? "border-red-500 bg-red-50" : "border-gray-200"
            }`}
          />
          {zipError && (
            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
              <CircleAlert className="w-4 h-4" />
              {zipError}
            </p>
          )}
          {detectedState && !zipError && (
            <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
              <BadgeCheck className="w-4 h-4" />
              {detectedState} detected
            </p>
          )}
        </div>

        <button
          onClick={onSubmit}
          disabled={zipCode.length !== 5}
          className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

interface Step3Props {
  age: string
  income: string
  detectedState: string | null
  onAgeChange: (value: string) => void
  onIncomeChange: (value: string) => void
  onSubmit: () => void
}

function Step3({ age, income, detectedState, onAgeChange, onIncomeChange, onSubmit }: Step3Props) {
  const ageRanges = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]
  const incomeRanges = [
    "Under $25,000",
    "$25,000 - $50,000",
    "$50,000 - $75,000",
    "$75,000 - $100,000",
    "Over $100,000"
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-red-600 font-bold text-sm">3</span>
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 text-base">
            Confirm your details
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {detectedState ? `Final verification for ${detectedState} residents.` : "Final verification step."}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age Range
          </label>
          <select
            value={age}
            onChange={(e) => onAgeChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-colors appearance-none bg-white"
          >
            <option value="">Select your age range</option>
            {ageRanges.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Income
          </label>
          <select
            value={income}
            onChange={(e) => onIncomeChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-colors appearance-none bg-white"
          >
            <option value="">Select your income range</option>
            {incomeRanges.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        <button
          onClick={onSubmit}
          disabled={!age || !income}
          className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
        >
          Check Eligibility
        </button>
      </div>
    </div>
  )
}

function Results({ displayAmount, detectedState }: { displayAmount: number; detectedState: string | null }) {
  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <BadgeCheck className="w-10 h-10 text-green-600" />
      </div>

      <div>
        <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
          <BadgeCheck className="w-4 h-4" />
          APPROVED
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-1">Your eligible refund amount:</p>
        <p className="text-5xl font-bold text-gray-900">
          ${displayAmount.toLocaleString()}
        </p>
      </div>

      {detectedState && (
        <p className="text-sm text-gray-600">
          Based on {detectedState} residency and provided information.
        </p>
      )}

      <div className="pt-4 space-y-3">
        <button className="w-full py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 text-lg">
          Connect to Agent
        </button>
        <p className="text-xs text-gray-500">
          An agent will help you complete your claim within 24-48 hours.
        </p>
      </div>
    </div>
  )
}
