'use client'

import { s } from '@/lib/reno/style'
import {
  CURRENCY,
  MONO,
  ONB_DOTS,
  ONB_PRESETS,
  SANS,
  SERIF,
  fmt,
} from '@/lib/reno/data'
import { ArrowLeft, ArrowRight, Check, Plus, X } from '../icons'

export type OnbState = {
  step: number
  name: string
  presets: string[]
  customs: string[]
  customDraft: string
  budget: string
}

export function freshOnb(): OnbState {
  return { step: 0, name: '', presets: [], customs: [], customDraft: '', budget: '' }
}

const STEP_META = [
  { label: 'Name', num: '1' },
  { label: 'Rooms', num: '2' },
  { label: 'Budget', num: '3' },
]
const PRESET_VALS = [10000, 25000, 50000, 100000]

export function Onboarding({
  onb,
  setOnb,
  onCancel,
  onFinish,
}: {
  onb: OnbState
  setOnb: (o: OnbState) => void
  onCancel: () => void
  onFinish: (o: OnbState) => void
}) {
  const roomCount = onb.presets.length + onb.customs.length
  const canAdvance =
    onb.step === 0
      ? onb.name.trim().length > 0
      : onb.step === 1
        ? roomCount > 0
        : Number(onb.budget) > 0
  const isLast = onb.step === 2

  const next = () => setOnb({ ...onb, step: Math.min(2, onb.step + 1) })
  const back = () => setOnb({ ...onb, step: Math.max(0, onb.step - 1) })
  const onContinue = () => {
    if (!canAdvance) return
    if (isLast) onFinish(onb)
    else next()
  }

  const togglePreset = (r: string) =>
    setOnb({
      ...onb,
      presets: onb.presets.includes(r) ? onb.presets.filter((x) => x !== r) : [...onb.presets, r],
    })

  const addCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const v = (onb.customDraft || '').trim()
    if (!v) return
    const lc = v.toLowerCase()
    const exists =
      onb.customs.some((x) => x.toLowerCase() === lc) ||
      ONB_PRESETS.some((x) => x.toLowerCase() === lc)
    if (exists) {
      setOnb({ ...onb, customDraft: '' })
      return
    }
    setOnb({ ...onb, customs: [...onb.customs, v], customDraft: '' })
  }
  const removeCustom = (r: string) => setOnb({ ...onb, customs: onb.customs.filter((x) => x !== r) })

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return
    const t = e.target as HTMLElement
    if (t?.dataset?.custom) return
    if (!canAdvance) return
    e.preventDefault()
    onContinue()
  }

  const continueBase = `display:inline-flex; align-items:center; gap:9px; border:none; border-radius:14px 12px 15px 13px; padding:13px 24px; font-size:15px; font-family:${SANS}; box-shadow:0 16px 36px -20px rgba(43,39,36,0.6);`
  const continueStyle =
    continueBase + (canAdvance ? ' cursor:pointer; opacity:1;' : ' cursor:not-allowed; opacity:0.4; box-shadow:none;')

  return (
    <div style={s('min-height:100vh; display:flex; flex-direction:column; background-color:transparent;')}>
      <header style={s('flex:0 0 auto; display:flex; align-items:center; justify-content:space-between; padding:20px 32px;')}>
        <button
          type="button"
          onClick={onCancel}
          style={s(`background:transparent; border:none; padding:0; cursor:pointer; font-family:${SERIF}; font-size:21px; letter-spacing:-0.01em; color:#2C2A26;`)}
        >
          Reno<span style={{ color: '#a96e4f' }}> Board</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rb-mut"
          style={s(`display:inline-flex; align-items:center; gap:7px; font-size:13px; color:#6B6253; background:transparent; border:none; cursor:pointer; font-family:${SANS};`)}
        >
          <X size={14} />
          Cancel
        </button>
      </header>

      <main style={s('flex:1; display:flex; align-items:flex-start; justify-content:center; padding:24px 24px 80px;')}>
        <div style={{ width: '100%', maxWidth: 660 }} onKeyDown={onKeyDown}>
          {/* step indicator */}
          <div style={s('display:flex; align-items:center; gap:10px; margin-bottom:34px;')}>
            {STEP_META.map((m, i) => {
              const done = i < onb.step
              const active = i === onb.step
              const on = done || active
              return (
                <div key={m.label} style={s('flex:1; display:flex; flex-direction:column; gap:8px;')}>
                  <div style={s(`height:4px; border-radius:999px; background:${on ? '#a96e4f' : '#E0D5BD'}; transition:background .3s;`)} />
                  <div style={s('display:flex; align-items:center; gap:7px;')}>
                    <span
                      style={s(
                        `display:inline-flex; align-items:center; justify-content:center; width:21px; height:21px; border-radius:999px; font-family:${MONO}; font-size:10.5px; ` +
                          (on ? 'background:#a96e4f; color:#F7F3E8;' : 'background:#E0D5BD; color:#9A9079;'),
                      )}
                    >
                      {done ? '✓' : m.num}
                    </span>
                    <span style={s(`font-family:${MONO}; font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:${on ? '#2C2A26' : '#a89f8c'};`)}>
                      {m.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* card */}
          <div style={s('background:#ECE2CF; border:1px solid #DDD0B5; border-radius:24px 19px 26px 21px; padding:40px 44px; box-shadow:0 22px 54px -42px rgba(44,42,38,0.32);')}>
            {onb.step === 0 && (
              <div>
                <StepKicker>Step 1 of 3</StepKicker>
                <StepTitle>Name your renovation</StepTitle>
                <StepBody>A project holds every room, job and price in one place. Give it something you&apos;ll recognise.</StepBody>
                <div style={{ marginTop: 28 }}>
                  <label style={s(`display:block; margin-bottom:8px; font-family:${MONO}; font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:#9A9079;`)}>Project name</label>
                  <input
                    value={onb.name}
                    onChange={(e) => setOnb({ ...onb, name: e.target.value })}
                    placeholder="e.g. Maple Street"
                    autoFocus
                    style={s(`width:100%; background:#E0D5BD; border:1px solid #E3D9C4; border-radius:14px; padding:14px 16px; font-family:${SERIF}; font-size:19px; color:#2C2A26;`)}
                  />
                </div>
              </div>
            )}

            {onb.step === 1 && (
              <div>
                <StepKicker>Step 2 of 3</StepKicker>
                <StepTitle>Which rooms are you touching?</StepTitle>
                <StepBody>Pick from the list or add your own. You can always change these later.</StepBody>
                <div style={s('margin-top:24px; display:grid; grid-template-columns:repeat(3,1fr); gap:10px;')}>
                  {ONB_PRESETS.map((name, i) => {
                    const sel = onb.presets.includes(name)
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => togglePreset(name)}
                        className="rb-bhover"
                        style={s(
                          `display:flex; align-items:center; gap:11px; text-align:left; padding:13px 14px; border-radius:13px 10px 14px 11px; cursor:pointer; font-family:${SANS}; font-size:14px; color:#2C2A26; ` +
                            (sel ? 'background:rgba(169,110,79,0.1); border:1px solid #a96e4f;' : 'background:#FCF8EE; border:1px solid #EBE1CE;'),
                        )}
                      >
                        <span
                          style={s(
                            `display:inline-flex; align-items:center; justify-content:center; width:20px; height:20px; flex:0 0 20px; border-radius:999px; ` +
                              (sel
                                ? 'background:#a96e4f; border:1px solid #a96e4f;'
                                : `background:transparent; border:1.5px solid ${ONB_DOTS[i % ONB_DOTS.length]};`),
                          )}
                        >
                          {sel && <Check size={12} sw={3} stroke="#F7F3E8" />}
                        </span>
                        <span style={s('white-space:nowrap; overflow:hidden; text-overflow:ellipsis;')}>{name}</span>
                      </button>
                    )
                  })}
                </div>

                <div style={s('margin-top:22px; padding-top:20px; border-top:1px solid rgba(207,197,179,0.7);')}>
                  <label style={s(`display:block; margin-bottom:9px; font-family:${MONO}; font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:#9A9079;`)}>Add a custom room</label>
                  <form onSubmit={addCustom} style={s('display:flex; gap:10px;')}>
                    <input
                      value={onb.customDraft}
                      onChange={(e) => setOnb({ ...onb, customDraft: e.target.value })}
                      data-custom="1"
                      placeholder="e.g. Conservatory, Loft…"
                      style={s(`flex:1; background:#E0D5BD; border:1px solid #E3D9C4; border-radius:12px; padding:11px 14px; font-size:14px; font-family:${SANS}; color:#2C2A26;`)}
                    />
                    <button
                      type="submit"
                      style={s(`display:inline-flex; align-items:center; gap:7px; background:#E0D5BD; color:#5B5347; border:none; border-radius:12px; padding:11px 16px; font-size:13.5px; cursor:pointer; font-family:${SANS};`)}
                    >
                      <Plus size={14} />
                      Add
                    </button>
                  </form>
                  {onb.customs.length > 0 && (
                    <div style={s('margin-top:13px; display:flex; flex-wrap:wrap; gap:8px;')}>
                      {onb.customs.map((c) => (
                        <span
                          key={c}
                          style={s('display:inline-flex; align-items:center; gap:8px; background:rgba(169,110,79,0.1); border:1px solid #a96e4f; border-radius:999px; padding:6px 8px 6px 14px; font-size:13.5px; color:#2C2A26;')}
                        >
                          {c}
                          <button
                            type="button"
                            onClick={() => removeCustom(c)}
                            aria-label="Remove"
                            style={s('width:20px; height:20px; border:none; background:transparent; color:#a96e4f; border-radius:999px; cursor:pointer; display:flex; align-items:center; justify-content:center;')}
                          >
                            <X size={12} sw={2.2} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {onb.step === 2 && (
              <div>
                <StepKicker>Step 3 of 3</StepKicker>
                <StepTitle>Set your total budget</StepTitle>
                <StepBody>The number you don&apos;t want to cross. Reno Board tracks every job and purchase against it.</StepBody>
                <div style={s('margin-top:28px; display:flex; align-items:center; gap:14px; background:#E0D5BD; border:1px solid #E3D9C4; border-radius:16px; padding:18px 22px;')}>
                  <span style={s(`font-family:${SERIF}; font-size:38px; font-weight:500; color:#a96e4f; line-height:1;`)}>{CURRENCY}</span>
                  <input
                    value={onb.budget ? fmt(onb.budget) : ''}
                    onChange={(e) => setOnb({ ...onb, budget: e.target.value.replace(/[^0-9]/g, '').slice(0, 9) })}
                    inputMode="numeric"
                    placeholder="0"
                    style={s(`flex:1; min-width:0; background:transparent; border:none; font-family:${SERIF}; font-size:38px; font-weight:500; color:#2C2A26; line-height:1; padding:0;`)}
                  />
                </div>
                <div style={s('margin-top:14px; display:flex; flex-wrap:wrap; gap:9px;')}>
                  {PRESET_VALS.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setOnb({ ...onb, budget: String(v) })}
                      className="rb-bhover"
                      style={s(
                        `background:transparent; border:1px solid ${onb.budget === String(v) ? '#a96e4f' : '#D2C5A9'}; border-radius:999px; padding:8px 15px; font-size:13px; cursor:pointer; font-family:${SANS}; color:${onb.budget === String(v) ? '#2C2A26' : '#6B6253'};`,
                      )}
                    >
                      {CURRENCY + (v >= 1000 ? v / 1000 + 'k' : v)}
                    </button>
                  ))}
                </div>
                <div style={s('margin-top:30px; padding-top:22px; border-top:1px solid rgba(207,197,179,0.7); display:flex; flex-wrap:wrap; gap:26px;')}>
                  <Recap label="Project" value={onb.name.trim() || 'Untitled project'} />
                  <Recap label="Rooms" value={roomCount === 0 ? '—' : roomCount + (roomCount === 1 ? ' room' : ' rooms')} />
                </div>
              </div>
            )}

            {/* footer */}
            <div style={s('margin-top:34px; display:flex; align-items:center; justify-content:space-between; gap:16px;')}>
              {onb.step > 0 ? (
                <button
                  type="button"
                  onClick={back}
                  className="rb-mut"
                  style={s(`display:inline-flex; align-items:center; gap:8px; background:transparent; border:none; padding:11px 6px; font-size:14px; color:#9A9079; cursor:pointer; font-family:${SANS};`)}
                >
                  <ArrowLeft size={15} />
                  Back
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={onContinue}
                disabled={!canAdvance}
                className={canAdvance ? 'rb-clay' : ''}
                style={s(continueStyle + (canAdvance ? '' : ' background:#a96e4f; color:#F7F3E8;'))}
              >
                {isLast ? 'Create my board' : 'Continue'}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StepKicker({ children }: { children: React.ReactNode }) {
  return <div style={s(`font-family:${MONO}; font-size:10.5px; letter-spacing:0.2em; text-transform:uppercase; color:#9A9079;`)}>{children}</div>
}
function StepTitle({ children }: { children: React.ReactNode }) {
  return <h1 style={s(`margin:10px 0 0; font-family:${SERIF}; font-size:32px; font-weight:500; line-height:1.15; letter-spacing:-0.01em; color:#2C2A26;`)}>{children}</h1>
}
function StepBody({ children }: { children: React.ReactNode }) {
  return <p style={s('margin:11px 0 0; font-size:15.5px; line-height:1.6; color:#5B5347;')}>{children}</p>
}
function Recap({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={s(`font-family:${MONO}; font-size:9.5px; letter-spacing:0.16em; text-transform:uppercase; color:#9A9079;`)}>{label}</div>
      <div style={s(`margin-top:5px; font-family:${SERIF}; font-size:17px; color:#2C2A26;`)}>{value}</div>
    </div>
  )
}
