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
import { Check, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/')({ component: Home })

type PasswordResponse = {
  length: boolean
  password: string
  original_password: string
}

function Home() {
  const [length, setLength] = useState(MIN_PASSWORD_LENGTH)
  const [isDirty, setIsDirty] = useState(false)
  const [includeSpecialCharacters, setIncludeSpecialCharacters] = useState(true)
  const [passwordResult, setPasswordResult] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isMinPassLengthMet, setIsMinPassLengthMet] = useState(true)

  const createNewPassword = async () => {
    setIsGenerating(true)
    setPasswordResult('')

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
        }),
      })
      let data

      const remainingTime = 350 - (Date.now() - startedAt)
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime))
      }

      if (response.ok) {
        data = (await response.json()) as PasswordResponse
        setPasswordResult(data.password)
      }
    } finally {
      setIsDirty(false)
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    createNewPassword()
  }, [])

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center p-6">
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="w-full rounded-2xl border border-gray-200 bg-white p-7 shadow-lg">
          <div className="grid lg:aspect-square grid-rows-[auto_1fr_auto] gap-6">
            <header>
              <p className="mb-1 text-sm font-medium uppercase tracking-widest text-gray-500">
                Secure utility
              </p>
              <h1 className="text-3xl font-bold">Password Generator</h1>
            </header>

            <div className="grid grid-cols-1 gap-4 self-center">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  Generated password
                </span>
                <div className="relative" aria-busy={isGenerating}>
                  <input
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
              </label>

              <div className="grid sm:grid-cols-[1fr_1fr] gap-3">
                <label className="flex min-h-20 items-center gap-2 rounded-xl border border-gray-200 px-4">
                  <Checkbox
                    checked={includeSpecialCharacters}
                    onCheckedChange={(status) => {
                      setIsDirty(!!isDirty)
                      setIncludeSpecialCharacters(!!status)
                    }}
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
                    onValueChange={(val) => {
                      setIsDirty(!!isDirty)
                      setLength(Number(val))
                    }}
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
              onClick={() => createNewPassword()}
              type="button"
            >
              Generate password
            </Button>
          </div>
        </section>

        <ContentCard
          subtitle="Secure your privacy"
          title="Recommended minimums"
        >
          <div className="grid h-full grid-cols-2 gap-4">
            <div className="flex h-full flex-col gap-4">
              <MiniCardItem
                subtitle="8 characters min."
                isValid={isMinPassLengthMet}
              >
                Each password should be at least 8 characters long, and no more
                than 64 characters.
              </MiniCardItem>
            </div>
            <div className="flex h-full flex-col gap-4">
              <MiniCardItem
                subtitle="8 characters min."
                isValid={includeSpecialCharacters}
              >
                Special characters make your password harder to guess.{' '}
                {isMinPassLengthMet && (
                  <>
                    Paired with a long password, it can take billions of years
                    for a password to be cracked!
                  </>
                )}
              </MiniCardItem>
            </div>
          </div>
        </ContentCard>
      </div>
    </main>
  )
}

const MiniCardItem = ({
  subtitle,
  isValid,
  children,
}: {
  subtitle: string
  isValid: boolean
  children?: React.ReactNode
}) => {
  return (
    <div className="flex flex-col rounded-lg border-neutral-200 bg-neutral-50 border-2 p-3 gap-y-2 text-black">
      <div className="flex flex-row items-center gap-x-3 mb-2">
        <span
          aria-label={isValid ? 'Requirement met' : 'Requirement not met'}
          className={`flex size-5 items-center justify-center rounded-full border-[1.5px] border-black/30 ${
            isValid
              ? 'bg-green-100 text-green-700'
              : 'bg-neutral-100 text-neutral-700'
          }`}
          role="img"
        >
          {isValid ? (
            <Check aria-hidden="true" size={12} />
          ) : (
            <X aria-hidden="true" size={12} />
          )}
        </span>

        <span className="text-neutral-600 font-semibold text-xs font-mono">
          {subtitle}
        </span>
      </div>
      <p className="text-neutral-700 text-sm">{children}</p>
    </div>
  )
}
