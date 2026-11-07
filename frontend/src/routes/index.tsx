import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import { Slider } from '#/components/ui/slider'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [length, setLength] = useState(12)
  const [includeSpecialCharacters, setIncludeSpecialCharacters] = useState(true)

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-4xl font-bold">Password Generator</h1>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium">
            Generated password
          </span>
          <input
            aria-label="Generated password"
            className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono"
            readOnly
            type="text"
            value={'abcd'}
          />
        </label>

        <label className="flex items-center gap-2">
          <Checkbox
            checked={includeSpecialCharacters}
            onCheckedChange={(status) => setIncludeSpecialCharacters(!!status)}
          />
          <span>Include special characters</span>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium">
            Length: {length}
          </span>
          <Slider
            aria-label="Password length"
            className="w-full"
            max={16}
            min={4}
            onValueChange={(val) => setLength(Number(val))}
            value={length}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>4</span>
            <span>16</span>
          </div>
        </label>

        <Button onClick={() => {}} type="button">
          Generate password
        </Button>
      </div>
    </main>
  )
}
