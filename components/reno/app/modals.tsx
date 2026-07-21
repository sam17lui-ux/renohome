'use client'

import { CURRENCY, MONO, SANS, SERIF, fmt } from '@/lib/reno/data'
import type { ColumnId } from '@/lib/reno/data'
import { s } from '@/lib/reno/style'
import type { AppVM } from '@/lib/reno/compute'
import type { JobDraft, JobForm, ProdForm } from './reno-app'
import { Box, Check, ExternalLink, Ticket, TrendingDown, TrendingUp, X } from '../icons'

type Column = { id: ColumnId; label: string }

const inputStyle = `width:100%; background:rgba(255,255,255,0.5); border:1px solid #E3D9C4; border-radius:12px; padding:10px 13px; font-size:14px; font-family:${SANS}; color:#2C2A26;`
const labelStyle = `display:block; margin-bottom:6px; font-family:${MONO}; font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:#9A9079;`
const primaryBtn = `border:none; border-radius:13px 11px 14px 12px; padding:11px 20px; font-size:13.5px; cursor:pointer; font-family:${SANS}; box-shadow:0 12px 30px -16px rgba(43,39,36,0.55);`
const cancelBtn = `background:transparent; border:none; padding:10px 14px; font-size:13.5px; color:#9A9079; cursor:pointer; font-family:${SANS};`

function ModalShell({
  onClose,
  maxWidth = 460,
  children,
}: {
  onClose: () => void
  maxWidth?: number
  children: React.ReactNode
}) {
  return (
    <div role="dialog" aria-modal="true" style={s('position:fixed; inset:0; z-index:60; display:flex; align-items:center; justify-content:center; padding:20px;')}>
      <div onClick={onClose} style={s('position:absolute; inset:0; background:rgba(43,39,36,0.42); backdrop-filter:blur(2px);')} />
      <div className="rb-fade" style={s(`position:relative; width:100%; max-width:${maxWidth}px; background:#FCF8EE; border:1px solid #EBE1CE; border-radius:22px 18px 24px 20px; padding:28px 30px; box-shadow:0 22px 54px -42px rgba(44,42,38,0.3);`)}>
        <button type="button" onClick={onClose} aria-label="Close" className="rb-mut" style={s('position:absolute; top:18px; right:18px; width:32px; height:32px; border:none; background:transparent; color:#9A9079; border-radius:999px; cursor:pointer; display:flex; align-items:center; justify-content:center;')}>
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={s(labelStyle)}>{label}</label>
      {children}
    </div>
  )
}

// ---------------- Add Job ----------------
export function AddJobModal({
  form,
  assignableRooms,
  columns,
  onField,
  onSubmit,
  onClose,
}: {
  form: JobForm
  assignableRooms: string[]
  columns: Column[]
  onField: (f: keyof JobForm, v: string) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}) {
  return (
    <ModalShell onClose={onClose}>
      <h2 style={s(`margin:0; font-family:${SERIF}; font-size:23px; font-weight:500; color:#2C2A26;`)}>Add a job</h2>
      <p style={s('margin:6px 0 0; font-size:13.5px; color:#6B6253; line-height:1.45;')}>Capture a piece of work — you can drag it along the board later.</p>
      <form onSubmit={onSubmit} style={s('margin-top:20px; display:flex; flex-direction:column; gap:15px;')}>
        <Field label="What needs doing">
          <input autoFocus value={form.title} onChange={(e) => onField('title', e.target.value)} placeholder="e.g. Retile bathroom floor" style={s(inputStyle)} />
        </Field>
        <div style={s('display:grid; grid-template-columns:1fr 1fr; gap:12px;')}>
          <Field label="Room">
            <select value={form.room} onChange={(e) => onField('room', e.target.value)} style={s(inputStyle)}>
              {assignableRooms.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </Field>
          <Field label="Stage">
            <select value={form.column} onChange={(e) => onField('column', e.target.value)} style={s(inputStyle)}>
              {columns.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </Field>
        </div>
        <div style={s('display:grid; grid-template-columns:1fr 1fr; gap:12px;')}>
          <Field label="Estimated cost (£)">
            <input type="number" min="0" value={form.cost} onChange={(e) => onField('cost', e.target.value)} placeholder="0" style={s(inputStyle)} />
          </Field>
          <Field label="Contractor / note">
            <input value={form.contractor} onChange={(e) => onField('contractor', e.target.value)} placeholder="e.g. Self" style={s(inputStyle)} />
          </Field>
        </div>
        <div style={s('display:flex; align-items:center; justify-content:flex-end; gap:12px; margin-top:4px;')}>
          <button type="button" onClick={onClose} className="rb-mut" style={s(cancelBtn)}>Cancel</button>
          <button type="submit" className="rb-clay" style={s(primaryBtn)}>Add job</button>
        </div>
      </form>
    </ModalShell>
  )
}

// ---------------- Add Product ----------------
export function AddProductModal({
  form,
  assignableRooms,
  retailers,
  onField,
  onSubmit,
  onClose,
}: {
  form: ProdForm
  assignableRooms: string[]
  retailers: string[]
  onField: (f: keyof ProdForm, v: string) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}) {
  return (
    <ModalShell onClose={onClose}>
      <h2 style={s(`margin:0; font-family:${SERIF}; font-size:23px; font-weight:500; color:#2C2A26;`)}>Watch a product</h2>
      <p style={s('margin:6px 0 0; font-size:13.5px; color:#6B6253; line-height:1.45;')}>We&apos;ll flag it when the price falls or meets your target.</p>
      <form onSubmit={onSubmit} style={s('margin-top:20px; display:flex; flex-direction:column; gap:15px;')}>
        <Field label="Product link (optional)">
          <input type="url" value={form.link} onChange={(e) => onField('link', e.target.value)} placeholder="https://…" style={s(inputStyle)} />
        </Field>
        <Field label="Product name">
          <input value={form.name} onChange={(e) => onField('name', e.target.value)} placeholder="e.g. Brushed brass mixer tap" style={s(inputStyle)} />
        </Field>
        <div style={s('display:grid; grid-template-columns:1fr 1fr; gap:12px;')}>
          <Field label="Retailer">
            <select value={form.retailer} onChange={(e) => onField('retailer', e.target.value)} style={s(inputStyle)}>
              {retailers.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </Field>
          <Field label="Room">
            <select value={form.room} onChange={(e) => onField('room', e.target.value)} style={s(inputStyle)}>
              {assignableRooms.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </Field>
        </div>
        <div style={s('display:grid; grid-template-columns:1fr 1fr; gap:12px;')}>
          <Field label="Current price (£)">
            <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => onField('price', e.target.value)} placeholder="0" style={s(inputStyle)} />
          </Field>
          <Field label="Target price (£)">
            <input type="number" min="0" step="0.01" value={form.target} onChange={(e) => onField('target', e.target.value)} placeholder="optional" style={s(inputStyle)} />
          </Field>
        </div>
        <div style={s('display:flex; align-items:center; justify-content:flex-end; gap:12px; margin-top:4px;')}>
          <button type="button" onClick={onClose} className="rb-mut" style={s(cancelBtn)}>Cancel</button>
          <button type="submit" className="rb-clay" style={s(primaryBtn)}>Watch product</button>
        </div>
      </form>
    </ModalShell>
  )
}

// ---------------- Adjust Budget ----------------
export function AdjustBudgetModal({
  projectName,
  draft,
  onDraft,
  onPreset,
  onSave,
  onClose,
}: {
  projectName: string
  draft: string
  onDraft: (v: string) => void
  onPreset: (v: string) => void
  onSave: (e: React.FormEvent) => void
  onClose: () => void
}) {
  const presets = [10000, 25000, 50000, 100000]
  return (
    <ModalShell onClose={onClose} maxWidth={430}>
      <h2 style={s(`margin:0; font-family:${SERIF}; font-size:23px; font-weight:500; color:#2C2A26;`)}>Adjust your budget</h2>
      <p style={s('margin:6px 0 0; font-size:13.5px; color:#6B6253; line-height:1.45;')}>Change the total cap for {projectName} — everything re-balances against it instantly.</p>
      <form onSubmit={onSave} style={s('margin-top:22px;')}>
        <div style={s('display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.5); border:1px solid #E3D9C4; border-radius:14px; padding:14px 18px;')}>
          <span style={s(`font-family:${SERIF}; font-size:30px; font-weight:500; color:#a96e4f; line-height:1;`)}>{CURRENCY}</span>
          <input value={draft ? fmt(draft) : ''} onChange={(e) => onDraft(e.target.value)} inputMode="numeric" placeholder="0" autoFocus style={s(`flex:1; min-width:0; background:transparent; border:none; font-family:${SERIF}; font-size:30px; font-weight:500; color:#2C2A26; line-height:1; padding:0;`)} />
        </div>
        <div style={s('margin-top:14px; display:flex; flex-wrap:wrap; gap:9px;')}>
          {presets.map((v) => (
            <button key={v} type="button" onClick={() => onPreset(String(v))} className="rb-bhover" style={s(`background:transparent; border:1px solid ${draft === String(v) ? '#a96e4f' : '#D2C5A9'}; border-radius:999px; padding:8px 15px; font-size:13px; cursor:pointer; font-family:${SANS}; color:${draft === String(v) ? '#2C2A26' : '#6B6253'};`)}>
              {CURRENCY + (v >= 1000 ? v / 1000 + 'k' : v)}
            </button>
          ))}
        </div>
        <div style={s('display:flex; align-items:center; justify-content:flex-end; gap:12px; margin-top:26px;')}>
          <button type="button" onClick={onClose} className="rb-mut" style={s(cancelBtn)}>Cancel</button>
          <button type="submit" className="rb-clay" style={s(primaryBtn)}>Save budget</button>
        </div>
      </form>
    </ModalShell>
  )
}

// ---------------- Job Detail ----------------
export function JobDetailModal({
  jobDetail,
  editing,
  draft,
  assignableRooms,
  columns,
  onClose,
  onStartEdit,
  onCancelEdit,
  onField,
  onSave,
}: {
  jobDetail: NonNullable<AppVM['jobDetail']>
  editing: boolean
  draft: JobDraft | null
  assignableRooms: string[]
  columns: Column[]
  onClose: () => void
  onStartEdit: () => void
  onCancelEdit: () => void
  onField: (f: keyof JobDraft, v: string) => void
  onSave: (e: React.FormEvent) => void
}) {
  return (
    <ModalShell onClose={onClose}>
      {editing && draft ? (
        <>
          <h2 style={s(`margin:0; font-family:${SERIF}; font-size:23px; font-weight:500; color:#2C2A26;`)}>Edit job</h2>
          <form onSubmit={onSave} style={s('margin-top:20px; display:flex; flex-direction:column; gap:15px;')}>
            <Field label="What needs doing">
              <input value={draft.title} onChange={(e) => onField('title', e.target.value)} style={s(inputStyle)} />
            </Field>
            <div style={s('display:grid; grid-template-columns:1fr 1fr; gap:12px;')}>
              <Field label="Room">
                <select value={draft.room} onChange={(e) => onField('room', e.target.value)} style={s(inputStyle)}>
                  {assignableRooms.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </Field>
              <Field label="Stage">
                <select value={draft.column} onChange={(e) => onField('column', e.target.value)} style={s(inputStyle)}>
                  {columns.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div style={s('display:grid; grid-template-columns:1fr 1fr; gap:12px;')}>
              <Field label="Estimated cost (£)">
                <input type="number" min="0" value={draft.cost} onChange={(e) => onField('cost', e.target.value)} style={s(inputStyle)} />
              </Field>
              <Field label="Contractor name">
                <input value={draft.contractor} onChange={(e) => onField('contractor', e.target.value)} placeholder="e.g. Self" style={s(inputStyle)} />
              </Field>
            </div>
            <Field label="Contractor contact">
              <input value={draft.contact} onChange={(e) => onField('contact', e.target.value)} placeholder="Phone or email" style={s(inputStyle)} />
            </Field>
            <div style={s('display:flex; align-items:center; justify-content:flex-end; gap:12px; margin-top:4px;')}>
              <button type="button" onClick={onCancelEdit} className="rb-mut" style={s(cancelBtn)}>Cancel</button>
              <button type="submit" className="rb-clay" style={s(primaryBtn)}>Save changes</button>
            </div>
          </form>
        </>
      ) : (
        <>
          <h2 style={s(`margin:0 26px 0 0; font-family:${SERIF}; font-size:23px; font-weight:500; color:#2C2A26; text-wrap:pretty;`)}>{jobDetail.title}</h2>
          <p style={s(`margin:8px 0 0; font-family:${MONO}; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:#9A9079;`)}>{jobDetail.room} · {jobDetail.columnLabel}</p>
          <div style={s(`margin-top:18px; display:inline-flex; align-items:center; gap:7px; font-family:${MONO}; font-size:14px; color:#2C2A26;`)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B0A691" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8" /><path d="M14.5 9.5a3 3 0 0 0-5 2.2c0 2 4 1.6 4 3.6a3 3 0 0 1-5 2.2" /></svg>
            {jobDetail.costLabel}
          </div>
          <hr style={s('height:1px; border:0; margin:20px 0 16px; background:linear-gradient(90deg,transparent,rgba(176,137,78,0.55),transparent);')} />
          <div style={s(`font-family:${MONO}; font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:#9A9079;`)}>Contractor</div>
          {jobDetail.hasContractor ? (
            <>
              <div style={s('margin-top:8px; font-size:15px; color:#2C2A26;')}>{jobDetail.contractor}</div>
              {jobDetail.hasContact ? (
                <div style={s('margin-top:4px; font-size:13.5px; color:#6B6253;')}>{jobDetail.contact}</div>
              ) : (
                <div style={s('margin-top:4px; font-size:13.5px; color:#B0A691;')}>No contact info added</div>
              )}
            </>
          ) : (
            <div style={s('margin-top:8px; font-size:14px; color:#B0A691;')}>No contractor added yet</div>
          )}
          {jobDetail.hasDue && (
            <>
              <div style={s(`margin-top:16px; font-family:${MONO}; font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:#9A9079;`)}>Due</div>
              <div style={s('margin-top:8px; font-size:15px; color:#2C2A26;')}>{jobDetail.due}</div>
            </>
          )}
          <div style={s('display:flex; align-items:center; justify-content:flex-end; gap:12px; margin-top:26px;')}>
            <button type="button" onClick={onClose} className="rb-mut" style={s(cancelBtn)}>Close</button>
            <button type="button" onClick={onStartEdit} className="rb-clay" style={s(primaryBtn)}>Edit</button>
          </div>
        </>
      )}
    </ModalShell>
  )
}

// ---------------- Product Detail ----------------
export function ProductDetailModal({
  detail,
  onClose,
  onBuy,
}: {
  detail: NonNullable<AppVM['detail']>
  onClose: () => void
  onBuy: () => void
}) {
  return (
    <ModalShell onClose={onClose} maxWidth={480}>
      <div style={s(`font-family:${MONO}; font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:#9A9079; padding-right:30px;`)}>{detail.meta}</div>
      <h2 style={s(`margin:7px 0 0; font-family:${SERIF}; font-size:22px; font-weight:500; line-height:1.25; color:#2C2A26; text-wrap:pretty; padding-right:20px;`)}>{detail.name}</h2>

      <div style={s('margin-top:13px; display:flex; flex-wrap:wrap; gap:8px;')}>
        {detail.dropped && (
          <span style={s('display:inline-flex; align-items:center; gap:5px; background:#9CAF88; color:#2E3823; border-radius:999px; padding:3px 11px; font-size:12px;')}>
            <TrendingDown size={13} /> Dropped {detail.dropLabel}
          </span>
        )}
        {detail.hitTarget && (
          <span style={s(`display:inline-flex; align-items:center; background:rgba(156,175,136,0.16); color:#677A53; border-radius:999px; padding:3px 11px; font-family:${MONO}; font-size:10px; letter-spacing:0.1em; text-transform:uppercase;`)}>At target</span>
        )}
        {detail.increased && (
          <span style={s('display:inline-flex; align-items:center; gap:5px; background:rgba(194,147,60,0.18); color:#8A6620; border-radius:999px; padding:3px 11px; font-size:12px;')}>
            <TrendingUp size={13} /> Price up {detail.increaseLabel}
          </span>
        )}
        {detail.backInStock && (
          <span style={s('display:inline-flex; align-items:center; gap:5px; background:transparent; border:1px solid #677A53; color:#677A53; border-radius:999px; padding:2px 11px; font-size:12px;')}>
            <Box size={12} /> Back in stock
          </span>
        )}
      </div>

      <div style={s('margin-top:18px; display:flex; align-items:flex-end; justify-content:space-between; gap:16px;')}>
        <div>
          <div style={s(`font-family:${SERIF}; font-size:34px; font-weight:500; color:#2C2A26; line-height:1;`)}>{detail.priceLabel}</div>
          <div style={s(`margin-top:5px; font-family:${MONO}; font-size:11px; color:#9A9079;`)}>target {detail.targetLabel}</div>
        </div>
        {detail.hasDiscount && (
          <div style={s('text-align:right;')}>
            <div style={s('display:inline-flex; align-items:center; gap:6px; font-size:11.5px; color:#6B6253;')}>
              <Ticket size={13} />
              <span style={s(`font-family:${MONO}; color:#2C2A26;`)}>{detail.discountCode}</span>
            </div>
            <div style={s(`margin-top:3px; font-family:${SERIF}; font-size:16px; color:#677A53;`)}>{detail.effectiveLabel}</div>
          </div>
        )}
      </div>

      <svg width="100%" height="84" viewBox={detail.bigViewBox} preserveAspectRatio="none" fill="none" style={{ marginTop: 16, display: 'block' }}>
        {detail.bigHasTarget && <line x1="4" y1={detail.bigTargetY} x2={detail.bigLineEnd} y2={detail.bigTargetY} stroke="#B0A691" strokeWidth="1" strokeDasharray="3 4" opacity="0.55" />}
        <path d={detail.bigPath} stroke={detail.bigColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={detail.bigLastX} cy={detail.bigLastY} r="3.2" fill={detail.bigColor} />
      </svg>

      <div style={s('margin-top:20px; display:flex; align-items:center; gap:12px;')}>
        <a href={detail.listingUrl} target="_blank" rel="noopener noreferrer" className="rb-clay" style={s(`flex:1; display:inline-flex; align-items:center; justify-content:center; gap:8px; border-radius:13px 11px 14px 12px; padding:12px 18px; font-size:13.5px; font-family:${SANS}; text-decoration:none; box-shadow:0 12px 30px -16px rgba(43,39,36,0.55);`)}>
          {detail.listingLabel}
          <ExternalLink size={15} />
        </a>
        <button type="button" onClick={onBuy} style={s(`display:inline-flex; align-items:center; gap:7px; white-space:nowrap; background:transparent; border:1px solid #677A53; color:#677A53; border-radius:13px; padding:12px 16px; font-size:13px; cursor:pointer; font-family:${SANS};`)}>
          <Check size={15} />
          Bought it
        </button>
      </div>
    </ModalShell>
  )
}
