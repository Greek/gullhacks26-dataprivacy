import { ContentCard } from '#/components/content-card'
import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import { Slider } from '#/components/ui/slider'
import {
  API_URL,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '#/lib/constants'
import { createFileRoute } from '@tanstack/react-router'
import {
  Check,
  Copy,
  Info,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  ShieldHalf,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState, type ReactElement } from 'react'

export const Route = createFileRoute('/')({ component: Home })

type CapitalizationOption = 'title' | 'random' | 'lower' | 'upper'
type SeparatorOption = 'number' | 'dash' | 'underscore' | 'period'

type PasswordAnalysis = {
  length: number
  score: number
  max_score?: number
  strength: 'Weak' | 'Moderate' | 'Strong' | 'Very Strong'
  special_characters: boolean
}

type PasswordResponse = {
  length: number
  password: string
  original_password: string
  capitalization: CapitalizationOption
  separator: SeparatorOption
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

const SEPARATOR_OPTIONS: {
  value: SeparatorOption
  label: string
  preview: string
}[] = [
  { value: 'number', label: 'Number', preview: '0–9' },
  { value: 'dash', label: 'Dash', preview: '-' },
  { value: 'underscore', label: 'Underscore', preview: '_' },
  { value: 'period', label: 'Period', preview: '.' },
]

function Home() {
  const [length, setLength] = useState(16)
  const [includeSpecialCharacters, setIncludeSpecialCharacters] = useState(true)
  const [capitalization, setCapitalization] =
    useState<CapitalizationOption>('title')
  const [separator, setSeparator] = useState<SeparatorOption>('number')
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
          separator: separator,
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
    const level = analysis?.strength.toLowerCase() ?? ''
    if (!analysis) {
      return {
        bars: 0,
        badge: 'border-gray-200 bg-gray-100 text-gray-600',
        activeBar: 'bg-gray-400',
        icon: null,
      }
    }
    if (level === 'very strong') {
      return {
        bars: 4,
        badge: 'border-green-300 bg-green-100 text-green-800',
        activeBar: 'bg-green-600',
        icon: <ShieldCheck className="size-3.5" />,
      }
    }
    if (level === 'strong') {
      return {
        bars: 3,
        badge: 'border-lime-300 bg-lime-50 text-lime-800',
        activeBar: 'bg-lime-500',
        icon: <ShieldCheck className="size-3.5" />,
      }
    }
    if (level === 'moderate' || level === 'medium') {
      return {
        bars: 2,
        badge: 'border-yellow-300 bg-yellow-50 text-yellow-800',
        activeBar: 'bg-yellow-400',
        icon: <ShieldHalf className="size-3.5" />,
      }
    }
    return {
      bars: 1,
      badge: 'border-red-200 bg-red-50 text-red-700',
      activeBar: 'bg-red-500',
      icon: <ShieldAlert className="size-3.5" />,
    }
  })()

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-6 p-6">
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
                  How to remember it
                </span>
                <p
                  aria-label="Password without special characters"
                  className="min-h-5 font-mono text-sm font-medium text-gray-800 break-all"
                >
                  {isGenerating
                    ? '...'
                    : originalPasswordResult
                      ? originalPasswordResult.replace(
                          /[a-zA-Z]+/g,
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase(),
                        )
                      : '—'}
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

                  <div aria-hidden="true" className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <span
                        key={step}
                        className={`h-1.5 rounded-full transition-colors ${
                          step <= strengthStyles.bars
                            ? strengthStyles.activeBar
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
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

            <div className="rounded-xl border border-gray-200 p-3.5">
              <span className="mb-2 block text-sm font-medium">
                Word separator
              </span>
              <div
                role="radiogroup"
                aria-label="Word separator"
                className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              >
                {SEPARATOR_OPTIONS.map((option) => {
                  const isSelected = separator === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSeparator(option.value)}
                      className={`flex flex-col items-center justify-center gap-0.5 rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                        isSelected
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{option.label}</span>
                      <span
                        className={`font-mono text-[11px] ${
                          isSelected ? 'text-gray-300' : 'text-gray-400'
                        }`}
                      >
                        {option.preview}
                      </span>
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

      <ContentCard
        title="Recommendations for a Safe Password"
        subtitle="Security Guide"
        aria-labelledby="safe-password-recommendations-title"
      >
        <MiniCardItem
          subtitle="Why Random Phrases Work"
          tone="none"
          mono={false}
        >
          <p className="text-sm leading-relaxed text-gray-700">
            Random phrases with{' '}
            <span className="font-semibold text-gray-900">
              no personal connection to yourself
            </span>{' '}
            are easy to remember and hard to crack. When you mix in{' '}
            <span className="font-semibold text-gray-900">
              random special characters and numbers
            </span>
            , attackers cannot rely on word lists—your password must be
            brute-forced character by character, which is far too slow to crack
            long passwords.
          </p>
        </MiniCardItem>

        <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <MiniCardItem
            subtitle={
              length >= 16
                ? '16+ characters (recommended)'
                : length >= 12
                  ? '12–15 characters (aim for 16+)'
                  : 'Under 12 characters (too short)'
            }
            tone={length >= 16 ? 'good' : length >= 12 ? 'warn' : 'danger'}
          >
            A password under 12 characters can be cracked by brute force easily.
            Using 16 or more characters makes brute-force cracking drastically
            harder.
          </MiniCardItem>

          <MiniCardItem subtitle="Avoid words & personal data" tone="info">
            Modern crackers don&apos;t just guess randomly—they try dictionary
            words, names, birthdays, and personal data first. Stick to unrelated
            random words.
          </MiniCardItem>

          <MiniCardItem
            subtitle="Add symbols & numbers"
            tone={includeSpecialCharacters ? 'good' : 'warn'}
          >
            Substituting special characters (like <kbd>@</kbd>, <kbd>&amp;</kbd>
            , <kbd>!</kbd>, or <kbd>*</kbd>) and numbers forces attackers into
            slow brute-force guessing instead of fast dictionary attacks.
          </MiniCardItem>

          <MiniCardItem subtitle="Unique per account" tone="key">
            Never reuse passwords across sites. Pair memorable random phrases
            with a password manager so one breach never compromises your other
            accounts.
          </MiniCardItem>
        </div>
      </ContentCard>
    </main>
  )
}

const MiniCardItem = ({
  subtitle,
  children,
  mono = true,
  tone,
}: {
  subtitle: string
  children?: React.ReactNode
  mono?: boolean
  tone: 'good' | 'warn' | 'danger' | 'info' | 'key' | 'none'
}) => {
  const badgeIcon = {
    good: <Check aria-hidden="true" className="size-3.5" />,
    warn: <ShieldHalf aria-hidden="true" className="size-3.5" />,
    danger: <ShieldAlert aria-hidden="true" className="size-3.5" />,
    info: <Info aria-hidden="true" className="size-3.5" />,
    key: <KeyRound aria-hidden="true" className="size-3.5" />,
    none: null,
  }[tone]

  const badgeStyles = {
    good: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    warn: 'border-amber-200 bg-amber-50 text-amber-700',
    danger: 'border-red-200 bg-red-50 text-red-700',
    info: 'border-gray-200 bg-gray-100 text-gray-700',
    key: 'border-gray-200 bg-gray-100 text-gray-700',
    none: '',
  }[tone]

  return (
    <div className="flex flex-col rounded-lg border-neutral-200 bg-neutral-50 border-2 p-3 gap-y-1 text-black">
      <div className="flex flex-row items-center gap-x-2.5 mb-1.5">
        {tone !== 'none' && (
          <span
            className={`flex size-5 items-center justify-center rounded-full border-[1.5px] ${badgeStyles}`}
            role="img"
          >
            {badgeIcon}
          </span>
        )}

        <span
          className={`text-neutral-600 font-semibold text-xs ${mono ? 'font-mono' : 'uppercase tracking-wider'}`}
        >
          {subtitle}
        </span>
      </div>
      <p className="text-neutral-700 text-sm text-pretty">{children}</p>
    </div>
  )
}
