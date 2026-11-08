import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import { Slider } from '#/components/ui/slider'
import {
  API_URL,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '#/lib/constants'
import { createFileRoute } from '@tanstack/react-router'
import { Check, Copy, ShieldAlert, ShieldCheck, ShieldHalf } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({ component: Home })

type CapitalizationOption = 'title' | 'random' | 'lower' | 'upper'

type PasswordAnalysis = {
  length: number
  score: number
  max_score: number
  strength: 'Weak' | 'Medium' | 'Strong'
  explanation: string
  special_characters: boolean
  feedback: string[]
}

type PasswordResponse = {
  length: number
  password: string
  original_password: string
  capitalization: CapitalizationOption
  analysis: PasswordAnalysis
}

const CAPITALIZATION_OPTIONS: {
  value: CapitalizationOption
  label: string
}[] = [
  { value: 'title', label: 'Title Case' },
  { value: 'random', label: 'Random' },
  { value: 'lower', label: 'Lowercase' },
  { value: 'upper', label: 'Full Case' },
]

function Home() {
  const [length, setLength] = useState(16)
  const [includeSpecialCharacters, setIncludeSpecialCharacters] = useState(true)
  const [capitalization, setCapitalization] =
    useState<CapitalizationOption>('title')
  const [passwordResult, setPasswordResult] = useState<string>('')
  const [originalPasswordResult, setOriginalPasswordResult] =
    useState<string>('')
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const copyTimeoutRef = useRef<number | null>(null)

  const createNewPassword = async () => {
    setIsGenerating(true)
    setIsCopied(false)
    setErrorMessage(null)
    setPasswordResult('')
    setOriginalPasswordResult('')

    try {
      const startedAt = Date.now()
      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          length: length,
          use_special_chars: includeSpecialCharacters,
          capitalization: capitalization,
        }),
      })

      const remainingTime = 350 - (Date.now() - startedAt)
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime))
      }

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`)
      }

      const data = (await response.json()) as PasswordResponse
      setPasswordResult(data.password)
      setOriginalPasswordResult(data.original_password)
      setAnalysis(data.analysis)
    } catch {
      setErrorMessage(
        `Could not connect to backend at ${API_URL}. Make sure backend/server.py is running.`,
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyPassword = async () => {
    if (!passwordResult) return

    try {
      await navigator.clipboard.writeText(passwordResult)
      setIsCopied(true)
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current)
      }
      copyTimeoutRef.current = window.setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch {
      setErrorMessage('Unable to copy password to clipboard.')
    }
  }

  useEffect(() => {
    void createNewPassword()
    return () => {
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  const strengthStyles = (() => {
    if (!analysis) {
      return {
        badge: 'border-gray-200 bg-gray-100 text-gray-600',
        activeBar: 'bg-gray-400',
        icon: null,
      }
    }
    if (analysis.strength === 'Strong') {
      return {
        badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        activeBar: 'bg-emerald-500',
        icon: <ShieldCheck className="size-3.5" />,
      }
    }
    if (analysis.strength === 'Medium') {
      return {
        badge: 'border-amber-200 bg-amber-50 text-amber-800',
        activeBar: 'bg-amber-500',
        icon: <ShieldHalf className="size-3.5" />,
      }
    }
    return {
      badge: 'border-red-200 bg-red-50 text-red-700',
      activeBar: 'bg-red-500',
      icon: <ShieldAlert className="size-3.5" />,
    }
  })()

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 items-center justify-center p-6">
      <section className="w-full rounded-2xl border border-gray-200 bg-white p-7 shadow-lg">
        <div className="grid grid-rows-[auto_1fr_auto] gap-6">
          <header className="text-center">
            <p className="mb-1 text-sm font-medium uppercase tracking-widest text-gray-500">
              Secure &amp; Memorable
            </p>
            <h1 className="text-3xl font-bold">Password Generator</h1>
          </header>

          <div className="grid grid-cols-1 gap-4 self-center">
            <div>
              <label
                htmlFor="generated-password-input"
                className="mb-2 block text-sm font-medium"
              >
                Generated password
              </label>
              <div className="flex items-stretch gap-2">
                <div className="relative flex-1" aria-busy={isGenerating}>
                  <input
                    id="generated-password-input"
                    aria-label="Generated password"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-4 text-center font-mono"
                    readOnly
                    type="text"
                    value={passwordResult}
                  />
                  <div
                    className={`absolute inset-0 flex items-center justify-center rounded-xl border border-gray-200 bg-white/85 backdrop-blur-sm transition-all duration-500 ${
                      isGenerating
                        ? 'scale-100 opacity-100'
                        : 'pointer-events-none scale-[0.98] opacity-0'
                    }`}
                    aria-hidden={!isGenerating}
                    role="status"
                  >
                    <div className="relative flex items-center gap-3 text-sm font-medium text-gray-600">
                      <span className="relative size-7">
                        <span className="absolute inset-0 rounded-full border-2 border-gray-200" />
                        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-gray-900 border-r-gray-600" />
                        <span className="absolute inset-[7px] animate-pulse rounded-full bg-gray-800" />
                      </span>
                      Generating
                    </div>
                  </div>
                </div>

                <Button
                  aria-label="Copy password to clipboard"
                  className="h-auto rounded-xl px-4"
                  disabled={!passwordResult || isGenerating}
                  onClick={() => void handleCopyPassword()}
                  type="button"
                  variant="outline"
                >
                  {isCopied ? (
                    <>
                      <Check className="size-4 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-3 rounded-xl border border-dashed border-gray-300 bg-gray-50/80 px-4 py-3 text-center">
                <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
                  How to remember it (Title Case)
                </span>
                <p
                  aria-label="Password without special characters"
                  className="min-h-5 font-mono text-sm font-medium text-gray-800 break-all"
                >
                  {isGenerating ? '...' : originalPasswordResult || '—'}
                </p>
              </div>

              {analysis && !isGenerating ? (
                <div
                  aria-live="polite"
                  className="mt-3 rounded-xl border border-gray-200 bg-white px-4 py-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      Password strength
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${strengthStyles.badge}`}
                    >
                      {strengthStyles.icon}
                      {analysis.strength}
                    </span>
                  </div>

                  <div
                    aria-hidden="true"
                    className="mb-2 grid grid-cols-3 gap-1.5"
                  >
                    {[1, 2, 3].map((step) => (
                      <span
                        key={step}
                        className={`h-1.5 rounded-full transition-colors ${
                          step <= analysis.score
                            ? strengthStyles.activeBar
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs leading-relaxed text-gray-600">
                    {analysis.explanation}
                  </p>
                </div>
              ) : null}

              {errorMessage ? (
                <p
                  role="alert"
                  className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-center text-xs text-red-700"
                >
                  {errorMessage}
                </p>
              ) : null}
            </div>

            <div className="rounded-xl border border-gray-200 p-3.5">
              <span className="mb-2 block text-sm font-medium">
                Capitalization
              </span>
              <div
                role="radiogroup"
                aria-label="Capitalization style"
                className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              >
                {CAPITALIZATION_OPTIONS.map((option) => {
                  const isSelected = capitalization === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setCapitalization(option.value)}
                      className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
                        isSelected
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
              <label className="flex min-h-20 items-center gap-2 rounded-xl border border-gray-200 px-4">
                <Checkbox
                  checked={includeSpecialCharacters}
                  onCheckedChange={(status) =>
                    setIncludeSpecialCharacters(!!status)
                  }
                />
                <span className="text-sm">Special characters</span>
              </label>

              <label className="flex min-h-20 flex-col justify-center rounded-xl border border-gray-200 px-4">
                <span className="mb-2 text-sm font-medium">
                  Length: {length}
                </span>
                <Slider
                  aria-label="Password length"
                  className="w-full"
                  min={MIN_PASSWORD_LENGTH}
                  max={MAX_PASSWORD_LENGTH}
                  onValueChange={(val) => setLength(Number(val))}
                  value={length}
                />
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>{MIN_PASSWORD_LENGTH}</span>
                  <span>{MAX_PASSWORD_LENGTH}</span>
                </div>
              </label>
            </div>
          </div>

          <Button
            className="w-full rounded-xl py-6"
            disabled={isGenerating}
            onClick={() => void createNewPassword()}
            type="button"
          >
            Generate password
          </Button>
        </div>
      </section>
    </main>
  )
}
