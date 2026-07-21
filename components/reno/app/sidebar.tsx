'use client'

import { s } from '@/lib/reno/style'
import { MONO, SANS, SERIF } from '@/lib/reno/data'
import type { AppVM, View } from '@/lib/reno/compute'
import { Bars, Check, ChevronDown, Grid, Plus, Tag } from '../icons'

export function Sidebar({
  vm,
  projectMenuOpen,
  onToggleProjectMenu,
  onSelectProject,
  onNewProject,
  onNav,
  onRoom,
}: {
  vm: AppVM
  projectMenuOpen: boolean
  onToggleProjectMenu: () => void
  onSelectProject: (id: string) => void
  onNewProject: () => void
  onNav: (v: View) => void
  onRoom: (room: string) => void
}) {
  const navItems: { id: View; label: string; icon: React.ReactNode; style: string }[] = [
    { id: 'overview', label: 'Overview', icon: <Grid size={17} />, style: vm.nav.overview },
    { id: 'board', label: 'Board', icon: <Bars size={17} />, style: vm.nav.board },
    { id: 'buying', label: 'Shopping', icon: <Tag size={17} />, style: vm.nav.buying },
  ]

  return (
    <aside
      style={s('width:256px; flex:0 0 256px; display:flex; flex-direction:column; background-color:#ECE2CF; border-right:1px solid #E3D9C4;')}
    >
      <div style={s('padding:26px 24px 20px;')}>
        <div style={s(`font-family:${SERIF}; font-size:21px; letter-spacing:-0.01em; color:#2C2A26;`)}>
          Reno<span style={{ color: '#a96e4f' }}> Board</span>
        </div>

        <div style={s('margin-top:18px; position:relative;')}>
          <button
            type="button"
            onClick={onToggleProjectMenu}
            className="rb-bhover"
            style={s(`width:100%; display:flex; align-items:center; gap:11px; background:#FCF8EE; border:1px solid #EBE1CE; border-radius:14px 12px 15px 13px; padding:10px 12px; cursor:pointer; text-align:left; font-family:${SANS};`)}
          >
            <span style={s(`width:30px; height:30px; flex:0 0 30px; border-radius:9px 7px 10px 8px; background:#a96e4f; display:flex; align-items:center; justify-content:center; font-family:${SERIF}; color:#F7F3E8; font-size:15px;`)}>
              {vm.projectInitial}
            </span>
            <span style={s('flex:1; min-width:0;')}>
              <span style={s('display:block; font-size:13.5px; font-weight:500; color:#2C2A26; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;')}>
                {vm.projectName}
              </span>
              <span style={s(`display:block; font-family:${MONO}; font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:#6B6253;`)}>
                {vm.projectMeta}
              </span>
            </span>
            <ChevronDown size={15} stroke="#9A9079" style={{ flex: '0 0 auto' }} />
          </button>

          {projectMenuOpen && (
            <>
              <div onClick={onToggleProjectMenu} style={s('position:fixed; inset:0; z-index:30;')} />
              <div style={s('position:absolute; top:calc(100% + 6px); left:0; right:0; z-index:40; background:#FCF8EE; border:1px solid #EBE1CE; border-radius:14px; padding:6px; box-shadow:0 22px 50px -28px rgba(43,39,36,0.55);')}>
                <div style={s(`padding:8px 10px 6px; font-family:${MONO}; font-size:9px; letter-spacing:0.2em; text-transform:uppercase; color:#9A9079;`)}>Your projects</div>
                {vm.projectList.map((pr) => (
                  <button key={pr.id} type="button" onClick={() => onSelectProject(pr.id)} className="rb-rowhover" style={s(pr.rowStyle)}>
                    <span style={s(`display:inline-flex; align-items:center; justify-content:center; width:26px; height:26px; flex:0 0 26px; border-radius:8px; background:#a96e4f; color:#F7F3E8; font-family:${SERIF}; font-size:13px;`)}>
                      {pr.initial}
                    </span>
                    <span style={s('flex:1; min-width:0;')}>
                      <span style={s('display:block; font-size:13px; color:#2C2A26; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;')}>{pr.name}</span>
                      <span style={s(`display:block; font-family:${MONO}; font-size:9.5px; letter-spacing:0.1em; text-transform:uppercase; color:#9A9079;`)}>{pr.meta}</span>
                    </span>
                    {pr.active && <Check size={15} sw={2.2} stroke="#a96e4f" style={{ flex: '0 0 auto' }} />}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={onNewProject}
                  className="rb-rowhover"
                  style={s(`display:flex; align-items:center; gap:10px; width:100%; margin-top:4px; padding:10px; border:none; border-top:1px solid rgba(207,197,179,0.6); background:transparent; cursor:pointer; text-align:left; font-family:${SANS}; color:#a96e4f; font-size:13px;`)}
                >
                  <span style={s('display:inline-flex; align-items:center; justify-content:center; width:26px; height:26px; flex:0 0 26px; border-radius:8px; border:1px dashed #C9966B; color:#a96e4f;')}>
                    <Plus size={14} />
                  </span>
                  New project
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <nav style={s('padding:4px 16px; display:flex; flex-direction:column; gap:3px;')}>
        {navItems.map((it) => (
          <button key={it.id} type="button" onClick={() => onNav(it.id)} className="rb-rowhover" style={s(it.style)}>
            {it.icon}
            {it.label}
          </button>
        ))}
      </nav>

      <div style={s(`margin:22px 24px 8px; font-family:${MONO}; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:#9A9079;`)}>Rooms</div>
      <div style={s('flex:1; min-height:0; overflow-y:auto; padding:0 16px 16px; display:flex; flex-direction:column; gap:1px;')}>
        {vm.roomNav.map((r) => (
          <button key={r.name} type="button" onClick={() => onRoom(r.name)} className="rb-mut" style={s(r.style)}>
            <span style={s('display:flex; align-items:center; gap:10px; min-width:0;')}>
              <span style={s(r.dot)} />
              <span style={s('white-space:nowrap; overflow:hidden; text-overflow:ellipsis;')}>{r.name}</span>
            </span>
            <span style={s(`font-family:${MONO}; font-size:10.5px; color:#9A9079;`)}>{r.count}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
