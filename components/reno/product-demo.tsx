import { s } from '@/lib/reno/style'
import { MONO, SERIF } from '@/lib/reno/data'
import { Calendar, Plus, TrendingDown, User } from './icons'

const COL_W = 158
const COL_GAP = 14
const STEP = COL_W + COL_GAP // distance the job card travels per column step

function DemoFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={s(
        'position:relative; width:100%; min-height:230px; border-radius:16px 12px 18px 13px; overflow:hidden; background-color:#ECE2CF; background-image:repeating-linear-gradient(135deg, rgba(169,110,79,0.05) 0 14px, rgba(169,110,79,0) 14px 28px); border:1px solid #EBE1CE;',
      )}
    >
      <div
        style={s(
          `position:absolute; top:14px; left:18px; z-index:1; font-family:${MONO}; font-size:9.5px; letter-spacing:0.16em; text-transform:uppercase; color:#B0A691;`,
        )}
      >
        {label}
      </div>
      {children}
    </div>
  )
}

/**
 * Two small CSS-only looping animations standing in for a real product demo
 * video: no camera footage exists, so these instead show the app's own
 * components in motion — pasting a link and watching its price drop, and a
 * job being created and dragged across the board — using the same visual
 * language as the rest of the page. No JS, no video file.
 */
export function ProductDemoLoop() {
  return (
    <div style={s('display:flex; flex-direction:column; gap:18px;')}>
      <DemoFrame label="Price tracking">
        <div className="demo-scene" style={s('position:absolute; inset:0; display:flex; align-items:center; justify-content:center; padding:44px 24px 24px;')}>
          <div style={s('width:100%; max-width:320px;')}>
            {/* paste-a-link input row — a fake cursor "types" a url, then it fades for the watched product card */}
            <div
              className="demo-price-input"
              style={s(
                'display:flex; align-items:center; gap:8px; background:rgba(252,248,238,0.85); border:1px solid #E3D9C4; border-radius:11px; padding:9px 12px;',
              )}
            >
              <span style={s('position:relative; flex:1; min-width:0; height:15px; overflow:hidden;')}>
                <span
                  style={s(
                    `position:absolute; inset:0; white-space:nowrap; font-size:12px; color:#9A9079; font-family:${MONO};`,
                  )}
                >
                  Paste a product link…
                </span>
                <span
                  className="demo-url-type"
                  style={s(
                    `position:absolute; inset:0; white-space:nowrap; overflow:hidden; font-size:12px; color:#2C2A26; font-family:${MONO}; background:rgba(252,248,238,0.85);`,
                  )}
                >
                  wayfair.co.uk/mixer-tap
                </span>
              </span>
              <span className="demo-add-btn" style={s('display:inline-flex; align-items:center; gap:5px; background:#a96e4f; color:#F7F3E8; border-radius:8px; padding:5px 9px; font-size:11px; flex:0 0 auto;')}>
                <Plus size={11} />
                Add
              </span>
            </div>

            {/* the watched product row — fades in over the input row */}
            <div
              className="demo-price-product"
              style={s(
                'margin-top:-42px; background:#FCF8EE; border:1px solid #EBE1CE; border-radius:13px 10px 14px 11px; padding:12px 14px;',
              )}
            >
              <div style={s(`font-family:${MONO}; font-size:9px; letter-spacing:0.12em; text-transform:uppercase; color:#9A9079;`)}>Wayfair · Bathroom</div>
              <div style={s(`margin-top:5px; font-family:${SERIF}; font-size:13px; color:#2C2A26;`)}>Brushed brass mixer tap</div>
              <div style={s('margin-top:9px; display:flex; align-items:flex-end; justify-content:space-between; gap:10px;')}>
                <svg width="76" height="28" viewBox="0 0 76 28" fill="none" style={{ overflow: 'visible' }}>
                  <path
                    className="demo-spark"
                    d="M2 6 L18 9 L34 8 L48 17 L62 23 L74 25"
                    stroke="#677A53"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="74" cy="25" r="2.4" fill="#677A53" />
                </svg>
                <div style={s('position:relative; text-align:right;')}>
                  <span className="demo-price-old" style={s(`display:block; font-family:${SERIF}; font-size:18px; color:#2C2A26;`)}>£58</span>
                  <span className="demo-price-new" style={s(`position:absolute; top:0; right:0; display:block; font-family:${SERIF}; font-size:18px; color:#2C2A26;`)}>£46</span>
                </div>
              </div>
              <div className="demo-pill-drop" style={s('margin-top:9px; display:inline-flex; align-items:center; gap:5px; background:#9CAF88; color:#2E3823; border-radius:999px; padding:3px 10px; font-size:10.5px;')}>
                <TrendingDown size={11} />
                Price dropped £12
              </div>
            </div>
          </div>
        </div>
      </DemoFrame>

      <DemoFrame label="The board">
        <div className="demo-scene" style={s('position:absolute; inset:0; display:flex; align-items:center; justify-content:center; padding:44px 20px 20px;')}>
          <div style={s(`position:relative; display:flex; gap:${COL_GAP}px;`)}>
            <MiniColumn label="Ideas" dot="#A7A093" plus />
            <MiniColumn label="Getting Quotes" dot="#D29A6B" />
            <MiniColumn label="Work Started" dot="#a96e4f" />

            <div
              className="demo-job-card"
              style={{ position: 'absolute', top: 33, left: 8, width: COL_W - 16 } as React.CSSProperties}
            >
              <div style={s('background:#FCF8EE; border:1px solid #EBE1CE; border-radius:11px 9px 12px 10px; padding:9px 10px;')}>
                <div style={s(`font-family:${SERIF}; font-size:11.5px; line-height:1.25; color:#2C2A26;`)}>Retile bathroom floor</div>
                <div style={s(`margin-top:6px; font-family:${MONO}; font-size:10px; color:#8A6620;`)}>£2,400</div>
                <div className="demo-pill-contractor" style={s('margin-top:7px; display:inline-flex; align-items:center; gap:4px; background:#ECE2CF; border-radius:999px; padding:2px 7px; font-size:9.5px; color:#6B6253;')}>
                  <User size={9} />
                  Dyer &amp; Sons
                </div>
                <div className="demo-pill-due" style={s('margin-top:5px; display:inline-flex; align-items:center; gap:4px; background:rgba(169,110,79,0.12); border-radius:999px; padding:2px 7px; font-size:9.5px; color:#a96e4f;')}>
                  <Calendar size={9} />
                  Due 27 Jun
                </div>
              </div>
            </div>
          </div>
        </div>
      </DemoFrame>
    </div>
  )
}

function MiniColumn({ label, dot, plus = false }: { label: string; dot: string; plus?: boolean }) {
  return (
    <div
      style={s(
        `flex:0 0 ${COL_W}px; width:${COL_W}px; height:150px; background:rgba(224,213,189,0.5); border:1px solid rgba(207,197,179,0.7); border-radius:14px 11px 15px 12px; padding:10px 9px;`,
      )}
    >
      <div style={s('display:flex; align-items:center; justify-content:space-between; gap:6px; padding-bottom:8px; border-bottom:1px solid rgba(207,197,179,0.7);')}>
        <span style={s('display:flex; align-items:center; gap:6px; min-width:0;')}>
          <span style={s(`width:6px; height:6px; flex:0 0 6px; border-radius:999px; background:${dot};`)} />
          <span style={s(`font-family:${SERIF}; font-size:11px; color:#2C2A26; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`)}>{label}</span>
        </span>
        {plus && (
          <span className="demo-add-pulse" style={s('display:inline-flex; align-items:center; justify-content:center; width:14px; height:14px; flex:0 0 14px; border-radius:5px; background:#a96e4f; color:#F7F3E8;')}>
            <Plus size={9} />
          </span>
        )}
      </div>
    </div>
  )
}
