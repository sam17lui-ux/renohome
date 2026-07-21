'use client'

import { s } from '@/lib/reno/style'
import { MONO, SANS, SERIF } from '@/lib/reno/data'
import type { AppVM } from '@/lib/reno/compute'
import { Pencil, Plus } from '../icons'

export function AppHeader({
  vm,
  onAddPrimary,
  onOpenBudget,
}: {
  vm: AppVM
  onAddPrimary: () => void
  onOpenBudget: () => void
}) {
  const b = vm.budgetBar
  return (
    <>
      <header style={s('flex:0 0 auto; display:flex; align-items:center; justify-content:space-between; gap:24px; padding:18px 36px; background:rgba(252,248,238,0.6);')}>
        <div style={s('min-width:0;')}>
          {vm.viewKicker && (
            <div style={s(`font-family:${MONO}; font-size:10.5px; letter-spacing:0.2em; text-transform:uppercase; color:#9A9079;`)}>{vm.viewKicker}</div>
          )}
          <h1 style={s(`margin:${vm.viewTitleMargin}; font-family:${SERIF}; font-size:27px; font-weight:500; letter-spacing:-0.01em; color:#2C2A26;`)}>{vm.viewTitle}</h1>
        </div>
        {vm.showAdd && (
          <button
            type="button"
            onClick={onAddPrimary}
            className="rb-clay rb-clay-lift"
            style={s(`display:inline-flex; align-items:center; gap:8px; border:none; border-radius:13px 11px 14px 12px; padding:10px 17px; font-size:13.5px; font-family:${SANS}; cursor:pointer; box-shadow:0 12px 30px -16px rgba(43,39,36,0.55); flex:0 0 auto;`)}
          >
            <Plus size={15} />
            {vm.addLabel}
          </button>
        )}
      </header>

      {/* budget bar */}
      <div style={s('flex:0 0 auto; display:flex; flex-wrap:wrap; align-items:center; gap:10px 15px; padding:12px 26px; border-top:1px solid #E3D9C4; border-bottom:1px solid #E3D9C4; background:rgba(224,213,189,0.7);')}>
        <button
          type="button"
          onClick={onOpenBudget}
          title="Adjust budget"
          className="rb-tinthover"
          style={s(`display:flex; align-items:baseline; gap:7px; flex:0 0 auto; background:transparent; border:none; cursor:pointer; padding:3px 7px; margin:-3px -3px; border-radius:9px; font-family:${SANS};`)}
        >
          <span style={s(`font-family:${MONO}; font-size:9.5px; letter-spacing:0.13em; text-transform:uppercase; color:#9A9079;`)}>Budget</span>
          <span style={s(`font-family:${SERIF}; font-size:15px; color:#2C2A26;`)}>{b.totalLabel}</span>
          <Pencil size={12} sw={2} stroke="#B0A691" style={{ alignSelf: 'center' }} />
        </button>
        <div style={s('display:flex; align-items:center; gap:7px; flex:0 0 auto;')}>
          <span style={s('width:8px; height:8px; border-radius:3px; background:#a96e4f;')} />
          <span style={s(`font-family:${MONO}; font-size:9.5px; letter-spacing:0.13em; text-transform:uppercase; color:#9A9079;`)}>Spent</span>
          <span style={s(`font-family:${SERIF}; font-size:14px; color:#2C2A26;`)}>{b.spentLabel}</span>
        </div>
        <div style={s('display:flex; align-items:center; gap:7px; flex:0 0 auto;')}>
          <span style={s('width:8px; height:8px; border-radius:3px; background:#C2933C;')} />
          <span style={s(`font-family:${MONO}; font-size:9.5px; letter-spacing:0.13em; text-transform:uppercase; color:#9A9079;`)}>Committed</span>
          <span style={s(`font-family:${SERIF}; font-size:14px; color:#8A6620;`)}>{b.committedLabel}</span>
        </div>
        <div style={s('flex:1; min-width:120px; position:relative; height:11px; border-radius:999px; background:#E0D5BD; overflow:hidden; box-shadow:inset 0 1px 2px rgba(43,39,36,0.12);')}>
          <div style={s(b.committedStyle)} />
          <div style={s(b.spentStyle)} />
        </div>
        <div style={s('display:flex; align-items:baseline; gap:7px; flex:0 0 auto;')}>
          <span style={s(`font-family:${MONO}; font-size:9.5px; letter-spacing:0.13em; text-transform:uppercase; color:#9A9079;`)}>{b.remainingLabel}</span>
          <span style={s(`font-family:${SERIF}; font-size:16px; color:${b.remainingColor};`)}>{b.remainingValue}</span>
        </div>
      </div>
    </>
  )
}
