'use client'

import { s } from '@/lib/reno/style'
import { MONO, SANS, SERIF } from '@/lib/reno/data'
import type { AppVM, EnrichedProduct } from '@/lib/reno/compute'
import { Box, Check, LinkChain, Plus, Refresh, Ticket, TrendingDown, TrendingUp, X } from '../icons'

export function Shopping({
  vm,
  pasteUrl,
  fetching,
  checking,
  onPaste,
  onPasteSubmit,
  onRoom,
  onClearBuyingJob,
  onOpenDetail,
  onToggleBought,
  onDeleteProduct,
  onRefresh,
  onRefreshAll,
}: {
  vm: AppVM
  pasteUrl: string
  fetching: boolean
  checking: string[]
  onPaste: (v: string) => void
  onPasteSubmit: (e: React.FormEvent) => void
  onRoom: (room: string) => void
  onClearBuyingJob: () => void
  onOpenDetail: (id: string) => void
  onToggleBought: (id: string) => void
  onDeleteProduct: (id: string) => void
  onRefresh: (id: string) => void
  onRefreshAll: () => void
}) {
  const anyRefreshable = vm.watchingItems.some((p) => p.canRefresh)
  const busy = checking.length > 0
  return (
    <div className="rb-fade" style={s('padding:28px 36px 60px; max-width:1040px;')}>
      <form onSubmit={onPasteSubmit} style={s('display:flex; gap:12px; max-width:560px; margin-bottom:22px;')}>
        <input
          type="url"
          value={pasteUrl}
          onChange={(e) => onPaste(e.target.value)}
          placeholder="Paste a product link to watch…"
          style={s(`flex:1; background:rgba(252,248,238,0.7); border:1px solid #E3D9C4; border-radius:13px; padding:11px 15px; font-size:13.5px; font-family:${SANS}; color:#2C2A26;`)}
        />
        <button type="submit" disabled={fetching} className="rb-clay" style={s(`display:inline-flex; align-items:center; gap:7px; border:none; border-radius:13px; padding:11px 17px; font-size:13.5px; cursor:${fetching ? 'wait' : 'pointer'}; opacity:${fetching ? '0.7' : '1'}; font-family:${SANS};`)}>
          {fetching ? <Refresh size={14} className="rb-spin" /> : <Plus size={14} />}
          {fetching ? 'Reading link…' : 'Add product'}
        </button>
      </form>

      {vm.buyingJobActive ? (
        <div style={s('display:flex; align-items:center; justify-content:space-between; gap:14px; margin-bottom:20px; background:rgba(169,110,79,0.1); border:1px solid rgba(169,110,79,0.25); border-radius:13px; padding:11px 16px;')}>
          <span style={s('display:inline-flex; align-items:center; gap:9px; font-size:13.5px; color:#2C2A26;')}>
            <LinkChain size={15} stroke="#a96e4f" />
            Linked to <span style={s(`font-family:${SERIF}; font-style:italic; color:#a96e4f;`)}>{vm.buyingJobLabel}</span>
          </span>
          <button type="button" onClick={onClearBuyingJob} className="rb-mut" style={s(`display:inline-flex; align-items:center; gap:6px; background:transparent; border:none; font-size:12.5px; color:#6B6253; cursor:pointer; font-family:${SANS};`)}>
            Show all
            <X size={13} />
          </button>
        </div>
      ) : (
        <div style={s('display:flex; flex-wrap:wrap; gap:7px; margin-bottom:24px;')}>
          {vm.roomTabs.map((t) => (
            <button key={t.name} type="button" onClick={() => onRoom(t.name)} className="rb-bhover-soft" style={s(t.style)}>
              {t.name}
            </button>
          ))}
        </div>
      )}

      <div style={s('display:flex; flex-wrap:wrap; gap:24px; margin-bottom:22px; padding-bottom:18px; border-bottom:1px solid rgba(207,197,179,0.6);')}>
        {vm.buyStats.map((ws) => (
          <div key={ws.label} style={s('display:flex; align-items:baseline; gap:9px;')}>
            <span style={s(`font-family:${SERIF}; font-size:23px; color:${ws.color};`)}>{ws.value}</span>
            <span style={s(`font-family:${MONO}; font-size:10px; letter-spacing:0.13em; text-transform:uppercase; color:#6B6253;`)}>{ws.label}</span>
          </div>
        ))}
      </div>

      {vm.hasWatching && (
        <>
          <div style={s('display:flex; align-items:baseline; justify-content:space-between; margin-bottom:13px;')}>
            <span style={s(`font-family:${MONO}; font-size:10.5px; letter-spacing:0.18em; text-transform:uppercase; color:#9A9079;`)}>Watching · {vm.watchingCount}</span>
            {anyRefreshable && (
              <button
                type="button"
                onClick={onRefreshAll}
                disabled={busy}
                className="rb-mut"
                title="Re-check live prices"
                style={s(`display:inline-flex; align-items:center; gap:6px; background:transparent; border:none; font-size:12px; color:#6B6253; cursor:${busy ? 'wait' : 'pointer'}; font-family:${SANS};`)}
              >
                <Refresh size={13} className={busy ? 'rb-spin' : undefined} />
                {busy ? 'Checking prices…' : 'Refresh prices'}
              </button>
            )}
          </div>
          <div style={s('display:flex; flex-direction:column; gap:12px; margin-bottom:34px;')}>
            {vm.watchingItems.map((p) => (
              <WatchingRow
                key={p.id}
                p={p}
                checking={checking.includes(p.id)}
                onOpen={onOpenDetail}
                onToggleBought={onToggleBought}
                onDelete={onDeleteProduct}
                onRefresh={onRefresh}
              />
            ))}
          </div>
        </>
      )}

      {vm.hasBought && (
        <>
          <div style={s('display:flex; align-items:baseline; justify-content:space-between; margin-bottom:13px;')}>
            <span style={s(`font-family:${MONO}; font-size:10.5px; letter-spacing:0.18em; text-transform:uppercase; color:#9A9079;`)}>Bought · {vm.boughtCount}</span>
            <span style={s('font-size:12.5px; color:#6B6253;')}>{vm.boughtTotalLabel} confirmed in budget</span>
          </div>
          <div style={s('display:flex; flex-direction:column; gap:10px;')}>
            {vm.boughtItems.map((p) => (
              <BoughtRow key={p.id} p={p} onToggleBought={onToggleBought} onDelete={onDeleteProduct} />
            ))}
          </div>
        </>
      )}

      {vm.noItems && (
        <p style={s('padding:54px 0; text-align:center; color:#9A9079;')}>Nothing here yet — paste a product link above to start watching its price.</p>
      )}
    </div>
  )
}

function Sparkline({ p }: { p: EnrichedProduct }) {
  return (
    <svg width={p.sparkW} height={p.sparkH} viewBox={p.sparkViewBox} fill="none" style={{ overflow: 'visible', flex: '0 0 auto' }}>
      {p.hasTargetLine && <line x1="4" y1={p.targetY} x2={p.sparkLineEnd} y2={p.targetY} stroke="#B0A691" strokeWidth="1" strokeDasharray="2 3" opacity="0.55" />}
      <path d={p.sparkPath} stroke={p.sparkColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={p.lastX} cy={p.lastY} r="2.6" fill={p.sparkColor} />
    </svg>
  )
}

function WatchingRow({
  p,
  checking,
  onOpen,
  onToggleBought,
  onDelete,
  onRefresh,
}: {
  p: EnrichedProduct
  checking: boolean
  onOpen: (id: string) => void
  onToggleBought: (id: string) => void
  onDelete: (id: string) => void
  onRefresh: (id: string) => void
}) {
  return (
    <article
      onClick={() => onOpen(p.id)}
      title="View details & listing"
      className="rb-hoverlift"
      style={s('display:flex; align-items:center; gap:22px; background:#FCF8EE; border:1px solid #EBE1CE; border-radius:16px 13px 17px 14px; padding:15px 20px; cursor:pointer;')}
    >
      <div style={s('flex:1; min-width:0;')}>
        <div style={s('display:flex; align-items:center; flex-wrap:wrap; gap:8px;')}>
          <span style={s(`font-family:${MONO}; font-size:9.5px; letter-spacing:0.13em; text-transform:uppercase; color:#9A9079;`)}>{p.meta}</span>
          {p.dropped && (
            <span style={s('display:inline-flex; align-items:center; gap:5px; white-space:nowrap; background:#9CAF88; color:#2E3823; border-radius:999px; padding:2px 9px; font-size:10.5px;')}>
              <TrendingDown size={11} />
              Dropped {p.dropLabel}
            </span>
          )}
          {p.hitTarget && (
            <span style={s(`display:inline-flex; align-items:center; white-space:nowrap; background:rgba(156,175,136,0.16); color:#677A53; border-radius:999px; padding:2px 9px; font-family:${MONO}; font-size:9px; letter-spacing:0.12em; text-transform:uppercase;`)}>At target</span>
          )}
          {p.increased && (
            <span style={s('display:inline-flex; align-items:center; gap:5px; white-space:nowrap; background:rgba(194,147,60,0.18); color:#8A6620; border-radius:999px; padding:2px 9px; font-size:10.5px;')}>
              <TrendingUp size={11} />
              Up {p.increaseLabel}
            </span>
          )}
          {p.backInStock && (
            <span style={s('display:inline-flex; align-items:center; gap:5px; white-space:nowrap; background:transparent; border:1px solid #677A53; color:#677A53; border-radius:999px; padding:1px 9px; font-size:10.5px;')}>
              <Box size={11} />
              Back in stock
            </span>
          )}
          {p.hasDiscount && (
            <span style={s('display:inline-flex; align-items:center; gap:5px; white-space:nowrap; background:#ECE2CF; border-radius:999px; padding:2px 9px; font-size:10.5px; color:#6B6253;')}>
              <Ticket size={11} />
              <span style={s(`font-family:${MONO}; color:#2C2A26;`)}>{p.discountCode}</span> {p.effectiveLabel}
            </span>
          )}
        </div>
        <h4 style={s(`margin:7px 0 0; font-family:${SERIF}; font-size:15.5px; font-weight:500; line-height:1.3; color:#2C2A26; text-wrap:pretty;`)}>{p.name}</h4>
      </div>
      <Sparkline p={p} />
      <div style={s('text-align:right; flex:0 0 auto; min-width:86px;')}>
        <div style={s(`font-family:${SERIF}; font-size:22px; font-weight:500; color:#2C2A26; line-height:1;`)}>{p.priceLabel}</div>
        <div style={s(`margin-top:4px; font-family:${MONO}; font-size:10.5px; color:#9A9079;`)}>target {p.targetLabel}</div>
      </div>
      <div style={s('display:flex; align-items:center; gap:6px; flex:0 0 auto;')}>
        {p.canRefresh && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRefresh(p.id)
            }}
            title="Re-check live price"
            className="rb-mut"
            style={s('width:32px; height:32px; flex:0 0 32px; border:none; background:transparent; color:#B0A691; border-radius:9px; cursor:pointer; display:flex; align-items:center; justify-content:center;')}
          >
            <Refresh size={14} className={checking ? 'rb-spin' : undefined} />
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleBought(p.id)
          }}
          style={s(`display:inline-flex; align-items:center; gap:6px; white-space:nowrap; background:transparent; border:1px solid #D2C5A9; border-radius:11px; padding:8px 13px; font-size:12.5px; color:#677A53; cursor:pointer; font-family:${SANS};`)}
        >
          <Check size={14} />
          Mark bought
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(p.id)
          }}
          title="Stop watching"
          className="rb-mut"
          style={s('width:32px; height:32px; flex:0 0 32px; border:none; background:transparent; color:#B0A691; border-radius:9px; cursor:pointer; display:flex; align-items:center; justify-content:center;')}
        >
          <X size={14} />
        </button>
      </div>
    </article>
  )
}

function BoughtRow({
  p,
  onToggleBought,
  onDelete,
}: {
  p: EnrichedProduct
  onToggleBought: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <article style={s('display:flex; align-items:center; gap:20px; background:rgba(252,248,238,0.55); border:1px solid #EBE1CE; border-radius:15px 12px 16px 13px; padding:13px 20px;')}>
      <span style={s('display:inline-flex; align-items:center; justify-content:center; width:26px; height:26px; flex:0 0 26px; border-radius:8px; background:#9CAF88; color:#2E3823;')}>
        <Check size={14} sw={2.2} />
      </span>
      <div style={s('flex:1; min-width:0;')}>
        <div style={s(`font-family:${MONO}; font-size:9.5px; letter-spacing:0.13em; text-transform:uppercase; color:#9A9079;`)}>{p.meta}</div>
        <h4 style={s(`margin:3px 0 0; font-family:${SERIF}; font-size:15px; font-weight:500; line-height:1.25; color:#5B5347; text-wrap:pretty;`)}>{p.name}</h4>
      </div>
      <div style={s('text-align:right; flex:0 0 auto; min-width:80px;')}>
        <div style={s(`font-family:${SERIF}; font-size:18px; color:#2C2A26;`)}>{p.effectiveLabel}</div>
        <div style={s(`font-family:${MONO}; font-size:9.5px; letter-spacing:0.1em; text-transform:uppercase; color:#677A53;`)}>Bought</div>
      </div>
      <div style={s('display:flex; align-items:center; gap:6px; flex:0 0 auto;')}>
        <button type="button" onClick={() => onToggleBought(p.id)} className="rb-mut" style={s(`white-space:nowrap; background:transparent; border:1px solid #D2C5A9; border-radius:11px; padding:7px 12px; font-size:12px; color:#6B6253; cursor:pointer; font-family:${SANS};`)}>
          Move to watching
        </button>
        <button type="button" onClick={() => onDelete(p.id)} title="Remove" className="rb-mut" style={s('width:30px; height:30px; flex:0 0 30px; border:none; background:transparent; color:#B0A691; border-radius:9px; cursor:pointer; display:flex; align-items:center; justify-content:center;')}>
          <X size={13} />
        </button>
      </div>
    </article>
  )
}
