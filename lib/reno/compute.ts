// ============================================================
// Reno Board — derived view-model for the app stage
// (faithful port of the prototype's renderVals, app portion)
// ============================================================
import {
  COLUMNS,
  CURRENCY,
  RETAILER_URL,
  effective,
  gbp,
  plural,
  roomColor,
  spark,
  type ColumnId,
  type Job,
  type Product,
  type Project,
} from './data'

export type View = 'overview' | 'board' | 'buying'

export type AppState = {
  projects: Project[]
  activeId: string
  view: View
  roomFilter: string
  buyingJob: string | null
  dragOverCol: ColumnId | null
  detailId: string | null
  jobDetailId: string | null
}

const mossPill = 'background:rgba(156,175,136,0.16); color:#677A53;'
const clayPill = 'background:rgba(169,110,79,0.15); color:#a96e4f;'

export function activeProject(state: AppState): Project {
  return (
    state.projects.find((p) => p.id === state.activeId) || state.projects[0]
  )
}

export function enrichProduct(p: Product) {
  const prev = p.history[p.history.length - 2] ?? p.price
  const dropped = p.price < prev
  const sp = spark(p.history, p.target)
  return {
    id: p.id,
    meta: `${p.retailer} · ${p.room}`,
    name: p.name,
    dropped,
    dropLabel: gbp(prev - p.price),
    hitTarget: p.price <= p.target,
    priceLabel: gbp(p.price),
    targetLabel: gbp(p.target),
    effectiveLabel: gbp(effective(p)),
    hasDiscount: !!p.discountCode,
    discountCode: p.discountCode || '',
    sparkPath: sp.d,
    sparkColor: dropped ? '#677A53' : '#8E8474',
    sparkW: sp.width,
    sparkH: sp.height,
    sparkViewBox: `0 0 ${sp.width} ${sp.height}`,
    sparkLineEnd: sp.width - 4,
    hasTargetLine: sp.targetY != null,
    targetY: sp.targetY != null ? sp.targetY : 0,
    lastX: sp.lastX,
    lastY: sp.lastY,
    increased: p.price > prev,
    increaseLabel: gbp(p.price - prev),
    backInStock: !!p.backInStock,
    retailer: p.retailer,
    room: p.room,
    listingUrl: p.link || RETAILER_URL[p.retailer] || '#',
  }
}

export type EnrichedProduct = ReturnType<typeof enrichProduct>

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
}

export function computeApp(state: AppState) {
  const active = activeProject(state)
  const jobs = active.jobs
  const products = active.products
  const rooms = active.rooms
  const total = active.budgetTotal
  const filterRoom = state.roomFilter
  const isAll = filterRoom === 'All rooms'
  const applyRoom = (room: string) => isAll || room === filterRoom

  const jobsCommitted = jobs
    .filter((j) => j.column !== 'ideas')
    .reduce((a, j) => a + (j.cost || 0), 0)
  const jobsSpent = jobs
    .filter((j) => j.column === 'complete')
    .reduce((a, j) => a + (j.cost || 0), 0)
  const boughtSpend = products
    .filter((p) => p.bought)
    .reduce((a, p) => a + effective(p), 0)
  const committed = jobsCommitted + boughtSpend
  const spent = jobsSpent + boughtSpend
  const remaining = total - committed
  const over = committed > total
  const pct = (v: number) => (total > 0 ? Math.min(Math.max(v, 0) / total, 1) * 100 : 0)

  const budgetBar = {
    totalLabel: gbp(total),
    spentLabel: gbp(spent),
    committedLabel: gbp(committed),
    remainingLabel: over ? 'Over by' : 'Remaining',
    remainingValue: over ? gbp(committed - total) : gbp(remaining),
    remainingColor: over ? '#A23C2D' : '#a96e4f',
    committedStyle: `position:absolute; inset:0 auto 0 0; width:${pct(committed).toFixed(1)}%; border-radius:999px; background:#C2933C; transition:width .6s ease;`,
    spentStyle: `position:absolute; inset:0 auto 0 0; width:${pct(spent).toFixed(1)}%; border-radius:999px; background:#a96e4f; transition:width .6s ease;`,
  }

  // ----- gauge (scope) -----
  const scopeJobs = isAll ? jobs : jobs.filter((j) => j.room === filterRoom)
  const scopeProducts = isAll ? products : products.filter((p) => p.room === filterRoom)
  const scBought = scopeProducts
    .filter((p) => p.bought)
    .reduce((a, p) => a + effective(p), 0)
  const scCommitted =
    scopeJobs.filter((j) => j.column !== 'ideas').reduce((a, j) => a + (j.cost || 0), 0) + scBought
  const scSpent =
    scopeJobs.filter((j) => j.column === 'complete').reduce((a, j) => a + (j.cost || 0), 0) + scBought
  const C2 = 2 * Math.PI * 96
  const sharePct = total > 0 ? Math.round((scCommitted / total) * 100) : 0
  const centerRawVal = isAll ? (over ? committed - total : remaining) : scCommitted
  const scope = {
    dashArray: C2.toFixed(1),
    committedOffset: (C2 - Math.min(total > 0 ? scCommitted / total : 0, 1) * C2).toFixed(1),
    spentOffset: (C2 - Math.min(total > 0 ? scSpent / total : 0, 1) * C2).toFixed(1),
    centerLabel: isAll ? (over ? 'Over budget' : 'Remaining') : filterRoom,
    centerValue: isAll ? (over ? '+' + gbp(committed - total) : gbp(remaining)) : gbp(scCommitted),
    centerRaw: centerRawVal,
    centerPrefix: isAll && over ? '+' : '',
    centerFontSize: (() => {
      const digits = String(Math.round(Math.abs(centerRawVal))).length
      return digits >= 6 ? 30 : digits === 5 ? 36 : digits === 4 ? 40 : 44
    })(),
    cur: CURRENCY,
    spentRaw: scSpent,
    committedRaw: scCommitted,
    centerColor: isAll ? (over ? '#A23C2D' : '#2C2A26') : '#2C2A26',
    subtitle: isAll ? `of ${gbp(total)}` : `${sharePct}% of ${gbp(total)}`,
    spentLabel: gbp(scSpent),
    committedLabel: gbp(scCommitted),
    thirdLabel: isAll ? 'Remaining' : 'Share of budget',
    thirdValue: isAll ? (over ? '—' : gbp(remaining)) : `${sharePct}%`,
    thirdRaw: isAll ? (over ? NaN : remaining) : sharePct,
    thirdCur: isAll ? CURRENCY : '',
    thirdSuffix: isAll ? '' : '%',
    thirdColor: isAll ? (over ? '#A23C2D' : '#2C2A26') : '#8A6620',
  }

  const linkedByJob: Record<string, Product[]> = {}
  products.forEach((p) => {
    if (p.jobId) (linkedByJob[p.jobId] = linkedByJob[p.jobId] || []).push(p)
  })

  // ----- sidebar rooms -----
  const roomNavBase = (a: boolean) =>
    `display:flex; align-items:center; justify-content:space-between; gap:8px; width:100%; background:${a ? '#FCF8EE' : 'transparent'}; border:1px solid ${a ? '#EBE1CE' : 'transparent'}; border-radius:10px; padding:8px 11px; font-size:13px; color:${a ? '#2C2A26' : '#6B6253'}; cursor:pointer; text-align:left;`
  const roomNav = [{ name: 'All rooms', count: jobs.length, dot: '#2C2A26' }]
    .concat(
      rooms.map((r, i) => ({
        name: r,
        count: jobs.filter((j) => j.room === r).length,
        dot: roomColor(r, i),
      })),
    )
    .map((r) => ({
      name: r.name,
      count: r.count,
      style: roomNavBase(filterRoom === r.name),
      dot: `width:8px; height:8px; flex:0 0 8px; border-radius:999px; background:${r.dot};`,
    }))

  // ----- board columns -----
  const columns = COLUMNS.map((col) => {
    const colJobs = jobs
      .filter((j) => j.column === col.id && applyRoom(j.room))
      .map((j) => {
        const linked = linkedByJob[j.id] || []
        const watchingLinked = linked.filter((p) => !p.bought)
        const droppedCount = watchingLinked.filter(
          (p) => p.price < (p.history[p.history.length - 2] ?? p.price),
        ).length
        const atTargetCount = watchingLinked.filter((p) => p.price <= p.target).length
        const boughtCount = linked.filter((p) => p.bought).length
        let bannerText = ''
        let tint = ''
        let tcol = ''
        if (droppedCount > 0) {
          bannerText = `Price dropped on ${plural(droppedCount, 'item')}`
          tint = 'rgba(156,175,136,0.14)'
          tcol = '#677A53'
        } else if (atTargetCount > 0) {
          bannerText = `${plural(atTargetCount, 'item')} at target price`
          tint = 'rgba(156,175,136,0.14)'
          tcol = '#677A53'
        } else if (watchingLinked.length > 0) {
          bannerText = `See ${plural(watchingLinked.length, 'item')} in shopping`
          tint = 'rgba(169,110,79,0.1)'
          tcol = '#a96e4f'
        } else if (boughtCount > 0) {
          bannerText = `${plural(boughtCount, 'item')} bought`
          tint = 'rgba(43,39,36,0.05)'
          tcol = '#6B6253'
        }
        return {
          id: j.id,
          title: j.title,
          room: j.room,
          costLabel: j.cost > 0 ? gbp(j.cost) : 'Cost TBC',
          costColor: j.cost > 0 ? '#2C2A26' : '#9A9079',
          hasContractor: !!j.contractor,
          contractor: j.contractor || '',
          hasDue: !!j.due,
          due: j.due || '',
          hasWatching: watchingLinked.length > 0,
          watchingLabel: `${watchingLinked.length} watching`,
          hasBanner: !!bannerText,
          bannerText,
          bannerStyle: `display:flex; align-items:center; justify-content:space-between; gap:8px; width:100%; margin-top:11px; background:${tint}; border:none; border-radius:10px; padding:8px 11px; font-size:12px; color:${tcol}; cursor:pointer; text-align:left;`,
        }
      })
    const isOver = state.dragOverCol === col.id
    const style = `flex:0 0 252px; width:252px; align-self:stretch; background:${isOver ? 'rgba(169,110,79,0.1)' : 'rgba(224,213,189,0.5)'}; border:1px ${isOver ? 'dashed #a96e4f' : 'solid rgba(207,197,179,0.5)'}; border-radius:18px; padding:14px 13px; transition:background .2s, border-color .2s;`
    return { id: col.id, label: col.label, accent: col.accent, count: colJobs.length, jobs: colJobs, style }
  })

  // ----- shopping -----
  const buyingJobActive = !!state.buyingJob
  const jobObj = buyingJobActive ? jobs.find((j) => j.id === state.buyingJob) : null
  const buyingJobLabel = jobObj ? jobObj.title : ''
  const base = buyingJobActive
    ? products.filter((p) => p.jobId === state.buyingJob)
    : products.filter((p) => applyRoom(p.room))
  const watchingRaw = base.filter((p) => !p.bought)
  const boughtRaw = base.filter((p) => p.bought)
  const watchingItems = watchingRaw.map(enrichProduct)
  const boughtItems = boughtRaw.map(enrichProduct)
  const shoppingTotal = watchingRaw.reduce((a, p) => a + effective(p), 0)
  const boughtTotal = boughtRaw.reduce((a, p) => a + effective(p), 0)
  const dropsNow = watchingRaw.filter(
    (p) => p.price < (p.history[p.history.length - 2] ?? p.price),
  ).length
  const atTarget = watchingRaw.filter((p) => p.price <= p.target).length
  const buyStats = [
    { value: gbp(shoppingTotal), label: 'Still to buy', color: '#2C2A26' },
    { value: String(dropsNow), label: 'Price drops', color: '#677A53' },
    { value: String(atTarget), label: 'At target', color: '#a96e4f' },
  ]
  const roomTabsBase = (a: boolean) =>
    `background:${a ? '#a96e4f' : 'rgba(252,248,238,0.6)'}; color:${a ? '#F7F3E8' : '#6B6253'}; border:1px solid ${a ? '#a96e4f' : '#E3D9C4'}; border-radius:999px; padding:6px 15px; font-size:12.5px; cursor:pointer; transition:all .2s;`
  const roomTabs = ['All rooms', ...rooms].map((r) => ({
    name: r,
    style: roomTabsBase(filterRoom === r),
  }))

  // ----- progress by room -----
  const roomCards = rooms
    .map((r) => {
      const rj = jobs.filter((j) => j.room === r)
      const done = rj.filter((j) => j.column === 'complete').length
      const cost =
        rj.reduce((a, j) => a + (j.cost || 0), 0) +
        products.filter((p) => p.room === r && p.bought).reduce((a, p) => a + effective(p), 0)
      const pc = rj.length ? Math.round((done / rj.length) * 100) : 0
      return { name: r, count: rj.length, done, cost, pct: pc }
    })
    .filter((r) => r.count > 0)
    .sort((a, b) => b.cost - a.cost)
    .map((r) => ({
      name: r.name,
      fraction: `${r.done}/${r.count}`,
      cost: r.cost > 0 ? gbp(r.cost) : 'Cost TBC',
      note: r.pct === 100 ? 'All done' : `${r.pct}% complete`,
      barStyle: `height:100%; width:${Math.max(r.pct, 3)}%; border-radius:999px; background:${r.pct === 100 ? '#677A53' : '#a96e4f'}; transition:width .6s ease;`,
      cardStyle: `background:#FCF8EE; border:1px solid ${!isAll && r.name === filterRoom ? '#a96e4f' : '#EBE1CE'}; border-radius:17px 14px 18px 15px; padding:18px 19px; opacity:${isAll || r.name === filterRoom ? '1' : '0.4'}; transition:opacity .4s ease, border-color .3s ease;`,
    }))

  // ----- overview signals -----
  const today = new Date(2026, 5, 13)
  const parseDue = (str: string) => {
    const m = /(\d{1,2})\s+([A-Za-z]{3,})/.exec(str || '')
    if (!m) return null
    const mo = MONTHS[m[2].slice(0, 3).toLowerCase()]
    if (mo == null) return null
    return Math.round((new Date(2026, mo, +m[1]).getTime() - today.getTime()) / 86400000)
  }
  const buyCand: { type: string; score: number; e: EnrichedProduct; signal: string }[] = []
  scopeProducts
    .filter((p) => !p.bought)
    .forEach((p) => {
      const e = enrichProduct(p)
      if (e.hitTarget) buyCand.push({ type: 'target', score: 100, e, signal: `At target · ${e.priceLabel}` })
      else if (e.backInStock) buyCand.push({ type: 'stock', score: 95, e, signal: 'Back in stock' })
      else if (e.dropped) buyCand.push({ type: 'drop', score: 80, e, signal: `Price dropped ${e.dropLabel}` })
    })
  const byType: Record<string, (typeof buyCand)[number]> = {}
  buyCand.forEach((b) => {
    if (!byType[b.type] || b.score > byType[b.type].score) byType[b.type] = b
  })
  const productUpdates = Object.values(byType)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((b) => ({
      key: 'buy-' + b.e.id,
      action: 'product',
      id: b.e.id,
      dot: '#677A53',
      title: b.e.name,
      sub: b.e.meta,
      signal: b.signal,
      pill: mossPill,
    }))
  const upcomingRaw = scopeJobs
    .filter((j) => j.due)
    .map((j) => ({ j, d: parseDue(j.due as string) }))
    .filter((x) => x.d != null && (x.d as number) < 7) as { j: Job; d: number }[]
  const upcomingJobs = upcomingRaw
    .sort((a, b) => a.d - b.d)
    .slice(0, 4)
    .map((x) => {
      const d = x.d
      const isQuote = /quote/i.test(x.j.due as string)
      const rel = d < 0 ? `${-d}d overdue` : d === 0 ? 'due today' : `in ${d} day${d === 1 ? '' : 's'}`
      return {
        key: 'due-' + x.j.id,
        action: 'job',
        id: x.j.id,
        dot: '#a96e4f',
        title: x.j.title,
        sub: x.j.room,
        signal: (isQuote ? 'Quote ' : 'Due ') + rel,
        pill: clayPill,
      }
    })

  // ----- detail modals -----
  const detailProd = state.detailId ? products.find((p) => p.id === state.detailId) : null
  const jobDetailJob = state.jobDetailId ? jobs.find((j) => j.id === state.jobDetailId) : null
  const jobDetail = jobDetailJob
    ? {
        id: jobDetailJob.id,
        title: jobDetailJob.title,
        room: jobDetailJob.room,
        columnLabel:
          (COLUMNS.find((c) => c.id === jobDetailJob.column) || ({} as { label?: string })).label ||
          jobDetailJob.column,
        costLabel: jobDetailJob.cost > 0 ? gbp(jobDetailJob.cost) : 'Cost TBC',
        hasContractor: !!jobDetailJob.contractor,
        contractor: jobDetailJob.contractor || '',
        noContractor: !jobDetailJob.contractor,
        hasContact: !!jobDetailJob.contact,
        contact: jobDetailJob.contact || '',
        noContact: !jobDetailJob.contact,
        hasDue: !!jobDetailJob.due,
        due: jobDetailJob.due || '',
      }
    : null
  let detail: (EnrichedProduct & {
    bigPath: string
    bigViewBox: string
    bigLastX: number
    bigLastY: number
    bigHasTarget: boolean
    bigTargetY: number
    bigLineEnd: number
    bigColor: string
    listingLabel: string
  }) | null = null
  if (detailProd) {
    const e = enrichProduct(detailProd)
    const dsp = spark(detailProd.history, detailProd.target, 300, 84)
    detail = {
      ...e,
      bigPath: dsp.d,
      bigViewBox: '0 0 300 84',
      bigLastX: dsp.lastX,
      bigLastY: dsp.lastY,
      bigHasTarget: dsp.targetY != null,
      bigTargetY: dsp.targetY != null ? dsp.targetY : 0,
      bigLineEnd: 296,
      bigColor: e.dropped ? '#677A53' : e.increased ? '#C2933C' : '#8E8474',
      listingLabel: `View listing at ${e.retailer}`,
    }
  }

  const view = state.view
  const titles: Record<View, { kicker: string; title: string }> = {
    overview: { kicker: '', title: active.name },
    board: { kicker: isAll ? `${active.name} · all rooms` : filterRoom, title: 'The board' },
    buying: {
      kicker: buyingJobActive ? 'Linked items' : isAll ? 'All rooms' : filterRoom,
      title: 'Shopping',
    },
  }

  const projectList = state.projects.map((p) => ({
    id: p.id,
    initial: (p.name.trim()[0] || 'P').toUpperCase(),
    name: p.name,
    meta: `${p.rooms.length} ${p.rooms.length === 1 ? 'room' : 'rooms'}`,
    active: p.id === state.activeId,
    rowStyle: `display:flex; align-items:center; gap:10px; width:100%; background:${p.id === state.activeId ? 'rgba(169,110,79,0.1)' : 'transparent'}; border:none; border-radius:10px; padding:9px 10px; cursor:pointer; text-align:left;`,
  }))

  const navStyle = (v: View) => {
    const a = state.view === v
    return `display:flex; align-items:center; gap:11px; width:100%; background:${a ? '#FCF8EE' : 'transparent'}; border:1px solid ${a ? '#EBE1CE' : 'transparent'}; border-radius:12px; padding:10px 13px; font-size:14px; color:${a ? '#2C2A26' : '#6B6253'}; cursor:pointer; text-align:left;`
  }
  const nav = { overview: navStyle('overview'), board: navStyle('board'), buying: navStyle('buying') }

  return {
    active,
    rooms,
    projectName: active.name,
    projectMeta: `${rooms.length} ${rooms.length === 1 ? 'room' : 'rooms'} · active`,
    projectInitial: (active.name.trim()[0] || 'P').toUpperCase(),
    projectList,
    nav,
    roomNav,
    isAll,
    filterRoom,
    viewKicker: titles[view].kicker,
    viewTitle: titles[view].title,
    viewTitleMargin: titles[view].kicker ? '3px 0 0' : '0',
    addLabel: view === 'buying' ? 'Add product' : 'Add job',
    showAdd: view === 'board' || view === 'buying',
    budgetBar,
    isOverview: view === 'overview',
    isBoard: view === 'board',
    isBuying: view === 'buying',
    scope,
    productUpdates,
    hasProductUpdates: productUpdates.length > 0,
    upcomingJobs,
    hasUpcomingJobs: upcomingJobs.length > 0,
    roomCards,
    columns,
    buyingJobActive,
    buyingJobLabel,
    roomTabs,
    buyStats,
    watchingItems,
    boughtItems,
    hasWatching: watchingItems.length > 0,
    hasBought: boughtItems.length > 0,
    watchingCount: watchingItems.length,
    boughtCount: boughtItems.length,
    boughtTotalLabel: gbp(boughtTotal),
    noItems: watchingItems.length === 0 && boughtItems.length === 0,
    detail,
    detailOpen: !!detail,
    jobDetail,
    jobDetailOpen: !!jobDetailJob,
  }
}

export type AppVM = ReturnType<typeof computeApp>
