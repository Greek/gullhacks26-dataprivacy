import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import { Slider } from '#/components/ui/slider'
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '#/lib/constants'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [length, setLength] = useState(12)
  const [includeSpecialCharacters, setIncludeSpecialCharacters] = useState(true)

  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center justify-center p-6">
      <section className="w-full rounded-2xl border border-gray-200 bg-white p-7 shadow-lg">
        <div className="grid aspect-square grid-rows-[auto_1fr_auto] gap-6">
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
              <input
                aria-label="Generated password"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-4 text-center font-mono"
                readOnly
                type="text"
                value={'abcd'}
              />
            </label>

            <div className="grid grid-cols-[1fr_1fr] gap-3">
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
            onClick={() => {}}
            type="button"
          >
            Generate password
          </Button>
        </div>
      </section>
    </main>
  )
}
