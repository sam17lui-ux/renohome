import Link from 'next/link'
import { s } from '@/lib/reno/style'
import { SERIF, MONO, SANS } from '@/lib/reno/data'
import {
  ArrowRight,
  Bars,
  Calendar,
  Gauge,
  Home,
  Plus,
  Play,
  Tag,
  TrendingDown,
  User,
} from './icons'

const START = '/app?start=1'

function CtaLarge({ children }: { children: React.ReactNode }) {
  return (
    <Link
      href={START}
      className="rb-clay rb-clay-lift"
      style={s(
        `display:inline-flex; align-items:center; gap:9px; border:none; border-radius:15px 12px 16px 13px; padding:15px 30px; font-size:16px; cursor:pointer; font-family:${SANS};`,
      )}
    >
      {children}
      <ArrowRight size={17} />
    </Link>
  )
}

export function Landing() {
  return (
    <div style={s('min-height:100vh; background-color:transparent;')}>
      {/* ---------- header ---------- */}
      <header
        style={s(
          'position:sticky; top:0; z-index:20; backdrop-filter:blur(6px); background:rgba(247,243,232,0.82); border-bottom:1px solid #E3D9C4;',
        )}
      >
        <div
          style={s(
            'max-width:1120px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; padding:17px 32px;',
          )}
        >
          <div style={s(`font-family:${SERIF}; font-size:21px; letter-spacing:-0.01em;`)}>
            Reno<span style={{ color: '#a96e4f' }}> Board</span>
          </div>
          <nav style={s('display:flex; align-items:center; gap:30px;')}>
            <a href="#how" className="rb-mut" style={s('font-size:14px; color:#5B5347;')}>
              How it works
            </a>
            <a href="#features" className="rb-mut" style={s('font-size:14px; color:#5B5347;')}>
              Features
            </a>
            <Link
              href={START}
              className="rb-clay"
              style={s(
                `display:inline-flex; align-items:center; gap:7px; white-space:nowrap; border:none; border-radius:11px 9px 12px 10px; padding:9px 16px; font-size:13.5px; cursor:pointer; font-family:${SANS};`,
              )}
            >
              Start planning free
              <ArrowRight size={14} />
            </Link>
          </nav>
        </div>
      </header>

      {/* ---------- hero ---------- */}
      <section style={s('max-width:880px; margin:0 auto; padding:84px 32px 26px; text-align:center;')}>
        <p
          style={s(
            `margin:0 0 26px; font-family:${MONO}; font-size:12px; letter-spacing:0.34em; text-transform:uppercase; color:#9A9079;`,
          )}
        >
          A renovation tracker
        </p>
        <h1
          style={s(
            `margin:0; font-family:${SERIF}; font-weight:500; font-size:clamp(44px,7vw,82px); line-height:1.02; letter-spacing:-0.015em; text-wrap:balance; color:#2C2A26;`,
          )}
        >
          Every job. Every price.
          <br />
          <span style={{ fontStyle: 'italic', color: '#a96e4f' }}>One board.</span>
        </h1>
        <p
          style={s(
            'margin:30px auto 0; max-width:560px; font-size:19px; line-height:1.55; color:#5B5347; text-wrap:pretty;',
          )}
        >
          The only tool that connects your renovation jobs to the products you&apos;re buying — and
          what they actually cost, right now.
        </p>
        <div style={s('margin-top:38px; display:flex; flex-direction:column; align-items:center; gap:14px;')}>
          <CtaLarge>Start planning free</CtaLarge>
        </div>
      </section>

      {/* ---------- product demo ---------- */}
      <section style={s('max-width:1000px; margin:0 auto; padding:40px 32px 30px;')}>
        <div
          style={s(
            'background:#FCF8EE; border:1px solid #E3D9C4; border-radius:26px 20px 28px 22px; padding:26px;',
          )}
        >
          <div
            style={s(
              'position:relative; aspect-ratio:16/9; width:100%; border-radius:16px 12px 18px 13px; overflow:hidden; background-color:#ECE2CF; background-image:repeating-linear-gradient(135deg, rgba(169,110,79,0.05) 0 14px, rgba(169,110,79,0) 14px 28px); display:flex; align-items:center; justify-content:center; border:1px solid #EBE1CE;',
            )}
          >
            <div
              style={s(
                `position:absolute; top:16px; left:18px; font-family:${MONO}; font-size:10.5px; letter-spacing:0.18em; text-transform:uppercase; color:#B0A691;`,
              )}
            >
              Product demo
            </div>
            <div
              style={s(
                `position:absolute; top:16px; right:18px; font-family:${MONO}; font-size:10.5px; letter-spacing:0.18em; text-transform:uppercase; color:#B0A691;`,
              )}
            >
              2:00
            </div>
            <Link
              href={START}
              className="rb-clay"
              style={s(
                'display:flex; align-items:center; justify-content:center; width:88px; height:88px; border:none; border-radius:999px; cursor:pointer; animation:renoPulse 3.4s ease-in-out infinite;',
              )}
            >
              <Play size={30} style={{ marginLeft: 4 }} />
            </Link>
          </div>
        </div>
        <p
          style={s(
            `margin:20px 0 0; text-align:center; font-family:${SERIF}; font-style:italic; font-size:18px; color:#6B6253;`,
          )}
        >
          See how Reno Board works in 2 minutes.
        </p>
      </section>

      <hr
        style={s(
          'height:1px; border:0; max-width:1000px; margin:56px auto 0; background:linear-gradient(90deg,transparent,rgba(176,137,78,0.6),transparent);',
        )}
      />

      {/* ---------- how it works ---------- */}
      <section id="how" style={s('max-width:1080px; margin:0 auto; padding:60px 32px;')}>
        <div style={s('text-align:center; margin-bottom:64px;')}>
          <p
            style={s(
              `margin:0 0 14px; font-family:${MONO}; font-size:11px; letter-spacing:0.3em; text-transform:uppercase; color:#9A9079;`,
            )}
          >
            How it works
          </p>
          <h2
            style={s(
              `margin:0; font-family:${SERIF}; font-weight:500; font-size:clamp(30px,4vw,42px); letter-spacing:-0.01em; color:#2C2A26;`,
            )}
          >
            From first idea to final receipt.
          </h2>
        </div>

        <div style={s('display:flex; flex-direction:column; gap:84px;')}>
          <Step
            n="01"
            title="Add your rooms & set a budget"
            body="Start with the spaces you're touching and the number you don't want to cross."
            icon={<Home size={22} />}
            illustration={<SetupIllustration />}
            imageRight
          />
          <Step
            n="02"
            title="Track your jobs on the board"
            body="Move each job from first idea to finished work — quotes, trades and costs travel with it."
            icon={<Bars size={22} />}
            illustration={<BoardIllustration />}
          />
          <Step
            n="03"
            title="Watch prices & know when to buy"
            body="Paste a product link and Reno Board flags the moment it drops or meets your target."
            icon={<Tag size={22} />}
            illustration={<ShoppingIllustration />}
            imageRight
          />
        </div>
      </section>

      {/* ---------- features ---------- */}
      <section
        id="features"
        style={s('background:rgba(252,248,238,0.55); border-top:1px solid #E3D9C4; border-bottom:1px solid #E3D9C4;')}
      >
        <div style={s('max-width:1080px; margin:0 auto; padding:66px 32px;')}>
          <div style={s('max-width:520px; margin-bottom:46px;')}>
            <p
              style={s(
                `margin:0 0 14px; font-family:${MONO}; font-size:11px; letter-spacing:0.3em; text-transform:uppercase; color:#9A9079;`,
              )}
            >
              What it does
            </p>
            <h2
              style={s(
                `margin:0; font-family:${SERIF}; font-weight:500; font-size:clamp(30px,4vw,42px); letter-spacing:-0.01em; text-wrap:balance; color:#2C2A26;`,
              )}
            >
              Doing and buying, finally on the same page.
            </h2>
          </div>
          <div style={s('display:grid; grid-template-columns:repeat(3,1fr); gap:22px;')}>
            <Feature
              icon={<Bars size={21} />}
              title="The board"
              body="Every job from first idea to finished work, arranged by room and how far along it is."
            />
            <Feature
              icon={<Gauge size={21} />}
              title="Budget always visible"
              body="Spent, committed and remaining — updated every time something on the board changes."
            />
            <Feature
              icon={<Tag size={21} />}
              title="Price watching"
              body="Paste a product link. We'll tell you when the price drops or hits your target."
            />
          </div>
        </div>
      </section>

      {/* ---------- closing ---------- */}
      <section style={s('max-width:760px; margin:0 auto; padding:84px 32px; text-align:center;')}>
        <h2
          style={s(
            `margin:0; font-family:${SERIF}; font-weight:500; font-size:clamp(32px,5vw,52px); line-height:1.05; letter-spacing:-0.015em; text-wrap:balance; color:#2C2A26;`,
          )}
        >
          Your renovation,
          <br />
          <span style={{ fontStyle: 'italic', color: '#a96e4f' }}>all in one place.</span>
        </h2>
        <div style={s('margin-top:34px; display:flex; flex-direction:column; align-items:center; gap:14px;')}>
          <CtaLarge>Start planning free</CtaLarge>
        </div>
      </section>

      {/* ---------- footer ---------- */}
      <footer style={s('border-top:1px solid #E3D9C4;')}>
        <div
          style={s(
            'max-width:1120px; margin:0 auto; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:16px; padding:28px 32px;',
          )}
        >
          <div style={s(`font-family:${SERIF}; font-size:17px;`)}>
            Reno<span style={{ color: '#a96e4f' }}> Board</span>
          </div>
          <div style={s('display:flex; gap:26px; font-size:13px; color:#6B6253;')}>
            <a href="#how" className="rb-mut">
              How it works
            </a>
            <a href="#features" className="rb-mut">
              Features
            </a>
            <Link href="/app" className="rb-mut" style={s(`font-family:${SANS};`)}>
              Open the board
            </Link>
          </div>
          <div style={s('font-size:12.5px; color:#9A9079;')}>Made for homeowners · © 2026</div>
        </div>
      </footer>
    </div>
  )
}

// ---------- how-it-works step ----------
function Step({
  n,
  title,
  body,
  icon,
  illustration,
  imageRight = false,
}: {
  n: string
  title: string
  body: string
  icon: React.ReactNode
  illustration: React.ReactNode
  imageRight?: boolean
}) {
  const copy = (
    <div>
      <div style={s('display:flex; align-items:center; gap:14px;')}>
        <span style={s(`font-family:${SERIF}; font-style:italic; font-size:26px; color:#a96e4f;`)}>{n}</span>
        <span
          style={s(
            'display:inline-flex; align-items:center; justify-content:center; width:46px; height:46px; border-radius:13px 10px 14px 11px; background:#ECE2CF; color:#a96e4f;',
          )}
        >
          {icon}
        </span>
      </div>
      <h3
        style={s(
          `margin:22px 0 0; font-family:${SERIF}; font-size:25px; font-weight:500; line-height:1.2; letter-spacing:-0.01em; color:#2C2A26; text-wrap:balance;`,
        )}
      >
        {title}
      </h3>
      <p style={s('margin:12px 0 0; font-size:16px; line-height:1.62; color:#5B5347; text-wrap:pretty;')}>{body}</p>
    </div>
  )
  const cols = imageRight ? '0.85fr 1.15fr' : '1.15fr 0.85fr'
  return (
    <div style={s(`display:grid; grid-template-columns:${cols}; gap:56px; align-items:center;`)}>
      {imageRight ? (
        <>
          {copy}
          {illustration}
        </>
      ) : (
        <>
          {illustration}
          {copy}
        </>
      )}
    </div>
  )
}

function IllustrationFrame({ kicker, title, right, children }: { kicker: string; title: string; right: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={s('background:#FCF8EE; border:1px solid #E3D9C4; border-radius:22px 18px 24px 20px; padding:13px;')}>
      <div style={s('border-radius:15px 11px 17px 12px; overflow:hidden; border:1px solid #EBE1CE; background-color:#F7F3E8;')}>
        <div
          style={s(
            'display:flex; align-items:center; justify-content:space-between; padding:15px 20px; border-bottom:1px solid #E3D9C4; background:rgba(252,248,238,0.6);',
          )}
        >
          <div>
            <div style={s(`font-family:${MONO}; font-size:9.5px; letter-spacing:0.2em; text-transform:uppercase; color:#9A9079;`)}>{kicker}</div>
            <div style={s(`margin-top:3px; font-family:${SERIF}; font-size:19px; font-weight:500; color:#2C2A26;`)}>{title}</div>
          </div>
          {right}
        </div>
        {children}
      </div>
    </div>
  )
}

function SetupIllustration() {
  const chip = (color: string, name: string) => (
    <span
      style={s('display:inline-flex; align-items:center; gap:7px; background:#FCF8EE; border:1px solid #EBE1CE; border-radius:999px; padding:6px 13px; font-size:13px; color:#2C2A26;')}
    >
      <span style={s(`width:8px; height:8px; border-radius:999px; background:${color};`)} />
      {name}
    </span>
  )
  return (
    <IllustrationFrame
      kicker="Setup"
      title="Maple Street"
      right={<span style={s(`font-family:${MONO}; font-size:9.5px; letter-spacing:0.14em; text-transform:uppercase; color:#6B6253;`)}>7 rooms · active</span>}
    >
      <div style={s('padding:20px;')}>
        <div style={s(`font-family:${MONO}; font-size:9.5px; letter-spacing:0.18em; text-transform:uppercase; color:#9A9079;`)}>Rooms you&apos;re touching</div>
        <div style={s('margin-top:11px; display:flex; flex-wrap:wrap; gap:8px;')}>
          {chip('#a96e4f', 'Kitchen')}
          {chip('#C2933C', 'Bathroom')}
          {chip('#9CAF88', 'Living room')}
          <span
            style={s('display:inline-flex; align-items:center; gap:6px; background:transparent; border:1px dashed #C9B68F; border-radius:999px; padding:6px 12px; font-size:13px; color:#9A9079;')}
          >
            <Plus size={12} />
            Add room
          </span>
        </div>
        <div style={s('margin-top:22px; background:#FCF8EE; border:1px solid #EBE1CE; border-radius:16px 12px 17px 13px; padding:17px 18px;')}>
          <div style={s('display:flex; align-items:baseline; justify-content:space-between;')}>
            <span style={s(`font-family:${MONO}; font-size:9.5px; letter-spacing:0.18em; text-transform:uppercase; color:#9A9079;`)}>Budget cap</span>
            <span style={s(`font-family:${SERIF}; font-size:28px; font-weight:500; color:#2C2A26; line-height:1;`)}>£40,000</span>
          </div>
          <div style={s('margin-top:13px; height:9px; border-radius:999px; background:#E0D5BD; overflow:hidden; box-shadow:inset 0 1px 2px rgba(43,39,36,0.12);')}>
            <div style={s('width:6%; height:100%; background:#a96e4f; border-radius:999px;')} />
          </div>
          <div style={s(`margin-top:9px; display:flex; align-items:center; justify-content:space-between; font-family:${MONO}; font-size:11px; color:#6B6253;`)}>
            <span>£0 spent</span>
            <span>£40,000 left</span>
          </div>
        </div>
      </div>
    </IllustrationFrame>
  )
}

function MiniColumn({ dot, label, count, children }: { dot: string; label: string; count: string; children: React.ReactNode }) {
  return (
    <div style={s('background:rgba(224,213,189,0.5); border:1px solid rgba(207,197,179,0.7); border-radius:14px 11px 15px 12px; padding:12px 11px;')}>
      <div style={s('display:flex; align-items:center; justify-content:space-between; padding-bottom:10px; border-bottom:1px solid rgba(207,197,179,0.7);')}>
        <span style={s(`display:flex; align-items:center; gap:7px; font-family:${SERIF}; font-size:13px; color:#2C2A26;`)}>
          <span style={s(`width:8px; height:8px; border-radius:999px; background:${dot};`)} />
          {label}
        </span>
        <span style={s(`font-family:${MONO}; font-size:10px; color:#9A9079;`)}>{count}</span>
      </div>
      <div style={s('margin-top:11px; display:flex; flex-direction:column; gap:9px;')}>{children}</div>
    </div>
  )
}

function MiniJob({ title, cost, costColor = '#6B6253', tag, shadow = false }: { title: string; cost: string; costColor?: string; tag?: React.ReactNode; shadow?: boolean }) {
  return (
    <div
      style={s(
        `background:#FCF8EE; border:1px solid #EBE1CE; border-radius:11px 9px 12px 10px; padding:10px 11px;${shadow ? ' box-shadow:0 10px 22px -18px rgba(43,39,36,0.5);' : ''}`,
      )}
    >
      <div style={s(`font-family:${SERIF}; font-size:12.5px; line-height:1.25; color:#2C2A26;`)}>{title}</div>
      <div style={s(`margin-top:7px; font-family:${MONO}; font-size:11px; color:${costColor};`)}>{cost}</div>
      {tag}
    </div>
  )
}

function BoardIllustration() {
  return (
    <IllustrationFrame
      kicker="Board"
      title="Every job, by stage"
      right={
        <span style={s('display:inline-flex; align-items:center; gap:6px; background:#a96e4f; color:#F7F3E8; border-radius:10px 8px 11px 9px; padding:6px 11px; font-size:11.5px;')}>
          <Plus size={12} />
          Add job
        </span>
      }
    >
      <div style={s('padding:18px; display:grid; grid-template-columns:repeat(3,1fr); gap:13px;')}>
        <MiniColumn dot="#9A9079" label="Ideas" count="2">
          <MiniJob title="Repaint hallway" cost="£420" />
          <MiniJob title="New blinds" cost="£300" />
        </MiniColumn>
        <MiniColumn dot="#C2933C" label="Quoting" count="1">
          <MiniJob
            title="Retile bathroom floor"
            cost="£2,400"
            costColor="#8A6620"
            shadow
            tag={
              <div style={s('margin-top:9px; display:inline-flex; align-items:center; gap:5px; background:#ECE2CF; border-radius:999px; padding:3px 8px; font-size:10px; color:#6B6253;')}>
                <User size={10} />
                Dyer &amp; Sons
              </div>
            }
          />
        </MiniColumn>
        <MiniColumn dot="#a96e4f" label="In progress" count="1">
          <MiniJob
            title="Kitchen cabinets"
            cost="£6,800"
            costColor="#a96e4f"
            tag={
              <div style={s('margin-top:9px; display:inline-flex; align-items:center; gap:5px; background:rgba(169,110,79,0.12); border-radius:999px; padding:3px 8px; font-size:10px; color:#a96e4f;')}>
                <Calendar size={10} />
                Fri
              </div>
            }
          />
        </MiniColumn>
      </div>
    </IllustrationFrame>
  )
}

function ShopRow({
  room,
  name,
  price,
  target,
  path,
  color,
  targetY,
  lastX,
  lastY,
  dropped,
  atTarget,
}: {
  room: string
  name: string
  price: string
  target: string
  path: string
  color: string
  targetY?: number
  lastX: number
  lastY: number
  dropped?: string
  atTarget?: boolean
}) {
  return (
    <div style={s('display:flex; align-items:center; gap:16px; background:#FCF8EE; border:1px solid #EBE1CE; border-radius:14px 11px 15px 12px; padding:13px 16px;')}>
      <div style={s('flex:1; min-width:0;')}>
        <div style={s('display:flex; align-items:center; gap:8px;')}>
          <span style={s(`font-family:${MONO}; font-size:9px; letter-spacing:0.13em; text-transform:uppercase; color:#9A9079;`)}>{room}</span>
          {dropped && (
            <span style={s('display:inline-flex; align-items:center; gap:4px; background:#9CAF88; color:#2E3823; border-radius:999px; padding:2px 8px; font-size:10px;')}>
              <TrendingDown size={10} />
              Dropped {dropped}
            </span>
          )}
          {atTarget && (
            <span style={s(`display:inline-flex; align-items:center; background:rgba(156,175,136,0.16); color:#677A53; border-radius:999px; padding:2px 8px; font-family:${MONO}; font-size:8.5px; letter-spacing:0.12em; text-transform:uppercase;`)}>
              At target
            </span>
          )}
        </div>
        <div style={s(`margin-top:6px; font-family:${SERIF}; font-size:14px; line-height:1.25; color:#2C2A26;`)}>{name}</div>
      </div>
      <svg width="58" height="30" viewBox="0 0 58 30" fill="none" style={{ flex: '0 0 auto' }}>
        {targetY != null && (
          <line x1="2" y1={targetY} x2="56" y2={targetY} stroke="#B0A691" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
        )}
        <path d={path} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={lastX} cy={lastY} r="2.6" fill={color} />
      </svg>
      <div style={s('text-align:right; flex:0 0 auto; min-width:74px;')}>
        <div style={s(`font-family:${SERIF}; font-size:19px; font-weight:500; color:#2C2A26; line-height:1;`)}>{price}</div>
        <div style={s(`margin-top:3px; font-family:${MONO}; font-size:10px; color:#9A9079;`)}>target {target}</div>
      </div>
    </div>
  )
}

function ShoppingIllustration() {
  return (
    <IllustrationFrame
      kicker="Shopping"
      title="Watching · 3"
      right={
        <span style={s(`display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.45); border:1px solid #E3D9C4; border-radius:10px; padding:7px 12px; font-family:${MONO}; font-size:11px; color:#9A9079;`)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
            <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
          </svg>
          Paste a link…
        </span>
      }
    >
      <div style={s('padding:18px; display:flex; flex-direction:column; gap:11px;')}>
        <ShopRow room="Kitchen" name="Brass mixer tap" price="£189" target="£200" dropped="£40" color="#677A53" targetY={11} lastX={56} lastY={24} path="M2 7 L14 9 L26 6 L38 16 L50 23 L56 24" />
        <ShopRow room="Living room" name="Oak floor lamp" price="£245" target="£210" color="#a96e4f" lastX={56} lastY={12} path="M2 14 L14 13 L26 15 L38 12 L50 13 L56 12" />
        <ShopRow room="Bathroom" name="Heated towel rail" price="£150" target="£150" atTarget color="#677A53" targetY={18} lastX={56} lastY={18} path="M2 9 L14 12 L26 11 L38 15 L50 17 L56 18" />
      </div>
    </IllustrationFrame>
  )
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div style={s('background:#FCF8EE; border:1px solid #EBE1CE; border-radius:20px 15px 21px 16px; padding:26px 24px;')}>
      <span style={s('display:inline-flex; align-items:center; justify-content:center; width:44px; height:44px; border-radius:12px 9px 13px 10px; background:#ECE2CF; color:#a96e4f;')}>
        {icon}
      </span>
      <h3 style={s(`margin:18px 0 0; font-family:${SERIF}; font-size:20px; font-weight:500; color:#2C2A26;`)}>{title}</h3>
      <p style={s('margin:9px 0 0; font-size:14.5px; line-height:1.6; color:#5B5347;')}>{body}</p>
    </div>
  )
}
