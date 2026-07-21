'use client'

import { s } from '@/lib/reno/style'
import { MONO, SERIF } from '@/lib/reno/data'
import type { AppVM } from '@/lib/reno/compute'
import { ChevronRight } from '../icons'

type Signal = AppVM['productUpdates'][number]

export function Overview({ vm, onAttention }: { vm: AppVM; onAttention: (action: string, id: string) => void }) {
  const sc = vm.scope
  return (
    <div className="rb-fade" style={s('padding:34px 36px 60px; max-width:1180px;')}>
      <div style={s('display:flex; flex-wrap:wrap; gap:26px; align-items:stretch;')}>
        {/* gauge card */}
        <div style={s('flex:0 0 340px; max-width:100%; background:#FCF8EE; border:1px solid #EBE1CE; border-radius:22px 18px 24px 20px; padding:28px 26px; display:flex; flex-direction:column; align-items:center;')}>
          <div style={s(`align-self:flex-start; font-family:${MONO}; font-size:10.5px; letter-spacing:0.2em; text-transform:uppercase; color:#9A9079;`)}>Where&apos;s the money</div>
          <div style={s('position:relative; width:226px; height:226px; margin:16px 0 4px;')}>
            <svg width="226" height="226" viewBox="0 0 236 236" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="118" cy="118" r="96" fill="none" stroke="#ECE2CF" strokeWidth="20" />
              <circle cx="118" cy="118" r="96" fill="none" stroke="#C2933C" strokeWidth="20" strokeLinecap="round" strokeDasharray={sc.dashArray} strokeDashoffset={sc.committedOffset} style={{ transition: 'stroke-dashoffset .7s cubic-bezier(.4,0,.2,1)' }} />
              <circle cx="118" cy="118" r="96" fill="none" stroke="#a96e4f" strokeWidth="20" strokeLinecap="round" strokeDasharray={sc.dashArray} strokeDashoffset={sc.spentOffset} style={{ transition: 'stroke-dashoffset .7s cubic-bezier(.4,0,.2,1)' }} />
            </svg>
            <div style={s('position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center;')}>
              <div style={s(`font-family:${MONO}; font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:#9A9079;`)}>{sc.centerLabel}</div>
              <div style={s('position:relative; overflow:hidden; padding:3px 6px; margin:-1px -6px;')}>
                <div
                  data-count-key="center"
                  data-count={sc.centerRaw}
                  data-count-prefix={sc.centerPrefix}
                  data-count-currency={sc.cur}
                  style={s(`font-family:${SERIF}; font-size:${sc.centerFontSize}px; font-weight:500; color:${sc.centerColor}; line-height:1.02; font-variant-numeric:tabular-nums; white-space:nowrap;`)}
                >
                  {sc.centerValue}
                </div>
              </div>
              <div style={s('font-size:11.5px; color:#6B6253; margin-top:3px;')}>{sc.subtitle}</div>
            </div>
          </div>
          <div style={s('width:100%; display:flex; flex-direction:column; gap:9px; margin-top:12px;')}>
            <GaugeRow color="#a96e4f" label="Spent" countKey="spent" raw={sc.spentRaw} cur={sc.cur} value={sc.spentLabel} valueColor="#2C2A26" />
            <GaugeRow color="#C2933C" label="Committed" countKey="committed" raw={sc.committedRaw} cur={sc.cur} value={sc.committedLabel} valueColor="#2C2A26" />
            <div style={s('display:flex; align-items:center; justify-content:space-between; font-size:13px; border-top:1px solid rgba(207,197,179,0.6); padding-top:9px;')}>
              <span style={s('display:flex; align-items:center; gap:9px; color:#5B5347;')}>
                <span style={s('width:10px; height:10px; border-radius:3px; background:#ECE2CF;')} />
                {sc.thirdLabel}
              </span>
              <span
                data-count-key="third"
                data-count={String(sc.thirdRaw)}
                data-count-currency={sc.thirdCur}
                data-count-suffix={sc.thirdSuffix}
                style={s(`font-family:${SERIF}; font-size:15px; color:${sc.thirdColor}; font-variant-numeric:tabular-nums;`)}
              >
                {sc.thirdValue}
              </span>
            </div>
          </div>
        </div>

        {/* panels */}
        <div style={s('flex:1 1 260px; min-width:0; display:flex; flex-direction:column; gap:18px;')}>
          <Panel title="Changes to your items" empty="No price drops or stock changes right now." items={vm.productUpdates} onAttention={onAttention} />
          <Panel title="Upcoming job" empty="Nothing due within the week." items={vm.upcomingJobs} onAttention={onAttention} />
        </div>
      </div>

      {/* progress by room */}
      <div style={s('margin-top:30px; display:flex; align-items:baseline; justify-content:space-between;')}>
        <h3 style={s(`margin:0; font-family:${SERIF}; font-size:19px; font-weight:500; color:#2C2A26;`)}>Progress by room</h3>
        <span style={s(`font-family:${MONO}; font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:#9A9079;`)}>Jobs complete · spend</span>
      </div>
      <div style={s('margin-top:16px; display:grid; grid-template-columns:repeat(3,1fr); gap:16px;')}>
        {vm.roomCards.map((rc) => (
          <div key={rc.name} style={s(rc.cardStyle)}>
            <div style={s('display:flex; align-items:center; justify-content:space-between;')}>
              <span style={s(`font-family:${SERIF}; font-size:16px; color:#2C2A26;`)}>{rc.name}</span>
              <span style={s(`font-family:${MONO}; font-size:11px; color:#6B6253;`)}>{rc.fraction}</span>
            </div>
            <div style={s('margin-top:13px; height:7px; border-radius:999px; background:#ECE2CF; overflow:hidden;')}>
              <div style={s(rc.barStyle)} />
            </div>
            <div style={s('margin-top:11px; display:flex; align-items:center; justify-content:space-between; font-size:12px; color:#6B6253;')}>
              <span style={s(`font-family:${SERIF}; color:#8A6620;`)}>{rc.cost}</span>
              <span>{rc.note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GaugeRow({
  color,
  label,
  countKey,
  raw,
  cur,
  value,
  valueColor,
}: {
  color: string
  label: string
  countKey: string
  raw: number
  cur: string
  value: string
  valueColor: string
}) {
  return (
    <div style={s('display:flex; align-items:center; justify-content:space-between; font-size:13px;')}>
      <span style={s('display:flex; align-items:center; gap:9px; color:#5B5347;')}>
        <span style={s(`width:10px; height:10px; border-radius:3px; background:${color};`)} />
        {label}
      </span>
      <span data-count-key={countKey} data-count={raw} data-count-currency={cur} style={s(`font-family:${SERIF}; font-size:15px; color:${valueColor}; font-variant-numeric:tabular-nums;`)}>
        {value}
      </span>
    </div>
  )
}

function Panel({
  title,
  empty,
  items,
  onAttention,
}: {
  title: string
  empty: string
  items: Signal[]
  onAttention: (action: string, id: string) => void
}) {
  return (
    <div style={s('background:#FCF8EE; border:1px solid #EBE1CE; border-radius:20px 16px 22px 18px; padding:22px 24px;')}>
      <h3 style={s(`margin:0; font-family:${SERIF}; font-size:17px; font-weight:500; color:#2C2A26;`)}>{title}</h3>
      <hr style={s('height:1px; border:0; margin:13px 0 4px; background:linear-gradient(90deg,transparent,rgba(176,137,78,0.55),transparent);')} />
      {items.length > 0 ? (
        <div style={s('display:flex; flex-direction:column;')}>
          {items.map((a) => (
            <button key={a.key} type="button" onClick={() => onAttention(a.action, a.id)} className="rb-tinthover" style={s('display:flex; align-items:center; gap:14px; width:100%; background:transparent; border:none; border-bottom:1px solid rgba(207,197,179,0.6); padding:13px 2px; cursor:pointer; text-align:left; font-family:inherit;')}>
              <span style={s(`width:9px; height:9px; flex:0 0 9px; border-radius:999px; background:${a.dot};`)} />
              <span style={s('flex:1; min-width:0;')}>
                <span style={s(`display:block; font-family:${SERIF}; font-size:14.5px; color:#2C2A26; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`)}>{a.title}</span>
                <span style={s(`display:block; font-family:${MONO}; font-size:9.5px; letter-spacing:0.1em; text-transform:uppercase; color:#9A9079; margin-top:2px;`)}>{a.sub}</span>
              </span>
              <span style={s(`white-space:nowrap; border-radius:999px; padding:4px 11px; font-size:12px; ${a.pill}`)}>{a.signal}</span>
              <ChevronRight size={15} sw={2} stroke="#B0A691" />
            </button>
          ))}
        </div>
      ) : (
        <p style={s('margin:10px 0 2px; font-size:13.5px; color:#9A9079;')}>{empty}</p>
      )}
    </div>
  )
}
