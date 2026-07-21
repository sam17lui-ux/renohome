'use client'

import { s } from '@/lib/reno/style'
import { MONO, SERIF } from '@/lib/reno/data'
import type { ColumnId } from '@/lib/reno/data'
import type { AppVM } from '@/lib/reno/compute'
import { ArrowRight, Calendar, Coin, Eye, User, X } from '../icons'

export function Board({
  vm,
  onOpenJobDetail,
  onDeleteJob,
  onOpenJobItems,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  vm: AppVM
  onOpenJobDetail: (id: string) => void
  onDeleteJob: (id: string) => void
  onOpenJobItems: (jobId: string) => void
  onDragStart: (e: React.DragEvent, id: string) => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent, col: ColumnId) => void
  onDragLeave: (e: React.DragEvent, col: ColumnId) => void
  onDrop: (e: React.DragEvent, col: ColumnId) => void
}) {
  return (
    <div className="rb-fade" style={s('padding:26px 28px 50px;')}>
      <div style={s('display:flex; gap:16px; align-items:flex-start; overflow-x:auto; padding-bottom:8px;')}>
        {vm.columns.map((col) => (
          <section
            key={col.id}
            onDragOver={(e) => onDragOver(e, col.id)}
            onDrop={(e) => onDrop(e, col.id)}
            onDragLeave={(e) => onDragLeave(e, col.id)}
            style={s(col.style)}
          >
            <div style={s('display:flex; align-items:center; justify-content:space-between; padding:2px 4px 12px; border-bottom:1px solid rgba(207,197,179,0.7); margin-bottom:14px;')}>
              <span style={s('display:flex; align-items:center; gap:9px;')}>
                <span style={s(`width:9px; height:9px; border-radius:999px; background:${col.accent};`)} />
                <span style={s(`font-family:${SERIF}; font-size:14.5px; color:#2C2A26;`)}>{col.label}</span>
              </span>
              <span style={s(`font-family:${MONO}; font-size:11px; color:#9A9079;`)}>{col.count}</span>
            </div>

            <div style={s('display:flex; flex-direction:column; gap:12px;')}>
              {col.jobs.map((job) => (
                <article
                  key={job.id}
                  draggable
                  onClick={() => onOpenJobDetail(job.id)}
                  onDragStart={(e) => onDragStart(e, job.id)}
                  onDragEnd={onDragEnd}
                  className="rb-hoverlift"
                  style={s('position:relative; background:#FCF8EE; border:1px solid #EBE1CE; border-radius:15px 12px 16px 13px; padding:14px 15px; cursor:pointer;')}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteJob(job.id)
                    }}
                    title="Remove job"
                    className="rb-mut"
                    style={s('position:absolute; top:9px; right:9px; width:22px; height:22px; border:none; background:transparent; color:#B0A691; border-radius:7px; cursor:pointer; display:flex; align-items:center; justify-content:center;')}
                  >
                    <X size={13} />
                  </button>
                  <h4 style={s(`margin:0 22px 0 0; font-family:${SERIF}; font-size:15px; font-weight:500; line-height:1.25; color:#2C2A26; text-wrap:pretty;`)}>{job.title}</h4>
                  <div style={s(`margin-top:6px; font-family:${MONO}; font-size:9.5px; letter-spacing:0.13em; text-transform:uppercase; color:#9A9079;`)}>{job.room}</div>
                  <div style={s(`margin-top:10px; display:inline-flex; align-items:center; gap:7px; font-family:${MONO}; font-size:13px; color:${job.costColor};`)}>
                    <Coin size={13} stroke="#B0A691" />
                    {job.costLabel}
                  </div>
                  <div style={s('margin-top:11px; display:flex; flex-wrap:wrap; gap:7px;')}>
                    {job.hasContractor && (
                      <span style={s('display:inline-flex; align-items:center; gap:5px; background:#ECE2CF; border-radius:999px; padding:3px 9px; font-size:11px; color:#6B6253; max-width:160px;')}>
                        <User size={11} />
                        <span style={s('white-space:nowrap; overflow:hidden; text-overflow:ellipsis;')}>{job.contractor}</span>
                      </span>
                    )}
                    {job.hasDue && (
                      <span style={s('display:inline-flex; align-items:center; gap:5px; white-space:nowrap; background:rgba(169,110,79,0.12); border-radius:999px; padding:3px 9px; font-size:11px; color:#a96e4f;')}>
                        <Calendar size={11} />
                        {job.due}
                      </span>
                    )}
                    {job.hasWatching && (
                      <span style={s('display:inline-flex; align-items:center; gap:5px; white-space:nowrap; background:rgba(169,110,79,0.14); border-radius:999px; padding:3px 9px; font-size:11px; color:#a96e4f;')}>
                        <Eye size={11} />
                        {job.watchingLabel}
                      </span>
                    )}
                  </div>
                  {job.hasBanner && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpenJobItems(job.id)
                      }}
                      style={s(job.bannerStyle)}
                    >
                      <span style={s('display:inline-flex; align-items:center; gap:7px;')}>{job.bannerText}</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
