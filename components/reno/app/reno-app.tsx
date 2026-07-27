'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  COLUMNS,
  RETAILERS,
  makeMapleStreet,
  type ColumnId,
  type Job,
  type Product,
  type Project,
} from '@/lib/reno/data'
import { computeApp, type View } from '@/lib/reno/compute'
import { extractProduct } from '@/lib/reno/extract'
import { loadState, saveState } from '@/lib/reno/storage'
import { Onboarding, type OnbState, freshOnb } from './onboarding'
import { Sidebar } from './sidebar'
import { AppHeader } from './app-header'
import { Overview } from './overview'
import { Board } from './board'
import { Shopping } from './shopping'
import {
  AddJobModal,
  AddProductModal,
  AdjustBudgetModal,
  JobDetailModal,
  ProductDetailModal,
} from './modals'

export type Stage = 'onboarding' | 'app'

export type JobForm = {
  title: string
  room: string
  column: ColumnId
  cost: string
  contractor: string
}
export type ProdForm = {
  link: string
  name: string
  retailer: string
  room: string
  price: string
  target: string
}
export type JobDraft = {
  title: string
  room: string
  column: ColumnId
  cost: string | number
  contractor: string
  contact: string
}

export type AppUIState = {
  stage: Stage
  projects: Project[]
  activeId: string
  projectMenu: boolean
  view: View
  roomFilter: string
  buyingJob: string | null
  detailId: string | null
  jobDetailId: string | null
  jobDetailEdit: boolean
  jobDetailDraft: JobDraft | null
  draggedId: string | null
  dragOverCol: ColumnId | null
  jobModal: boolean
  jobForm: JobForm
  prodModal: boolean
  prodForm: ProdForm
  pasteUrl: string
  fetching: boolean
  fetchError: string | null
  checking: string[]
  budgetModal: boolean
  budgetDraft: string
  onb: OnbState
}

export function RenoApp({ initialStage = 'app' }: { initialStage?: Stage }) {
  const [state, setState] = useState<AppUIState>(() => ({
    stage: initialStage,
    projects: [makeMapleStreet()],
    activeId: 'maple',
    projectMenu: false,
    view: 'overview',
    roomFilter: 'All rooms',
    buyingJob: null,
    detailId: null,
    jobDetailId: null,
    jobDetailEdit: false,
    jobDetailDraft: null,
    draggedId: null,
    dragOverCol: null,
    jobModal: false,
    jobForm: { title: '', room: 'Kitchen', column: 'ideas', cost: '', contractor: '' },
    prodModal: false,
    prodForm: { link: '', name: '', retailer: 'B&Q', room: 'Kitchen', price: '', target: '' },
    pasteUrl: '',
    fetching: false,
    fetchError: null,
    checking: [],
    budgetModal: false,
    budgetDraft: '',
    onb: freshOnb(),
  }))

  const patch = useCallback(
    (p: Partial<AppUIState> | ((s: AppUIState) => Partial<AppUIState>)) =>
      setState((s) => ({ ...s, ...(typeof p === 'function' ? p(s) : p) })),
    [],
  )

  const activeProject = () => state.projects.find((p) => p.id === state.activeId) || state.projects[0]

  const patchActive = useCallback(
    (updater: (p: Project) => Project, extra: Partial<AppUIState> = {}) =>
      setState((s) => ({
        ...s,
        projects: s.projects.map((p) => (p.id === s.activeId ? updater(p) : p)),
        ...extra,
      })),
    [],
  )

  // ---------- stage / project nav ----------
  const goApp = () => patch({ stage: 'app' })
  const onbCancel = () => patch({ stage: 'app' })
  const newProject = () => patch({ stage: 'onboarding', projectMenu: false, onb: freshOnb() })
  const toggleProjectMenu = () => patch((s) => ({ projectMenu: !s.projectMenu }))
  const selectProject = (id: string) =>
    patch({ activeId: id, projectMenu: false, view: 'overview', roomFilter: 'All rooms', buyingJob: null })

  const finishOnb = (onb: OnbState) => {
    const rooms = [...onb.presets, ...onb.customs]
    const id = 'proj-' + Date.now()
    const proj: Project = {
      id,
      name: onb.name.trim() || 'Untitled project',
      rooms,
      budgetTotal: Number(onb.budget) || 0,
      jobs: [],
      products: [],
    }
    patch((s) => ({
      projects: [...s.projects, proj],
      activeId: id,
      stage: 'app',
      view: 'overview',
      roomFilter: 'All rooms',
      buyingJob: null,
      onb: freshOnb(),
    }))
  }

  // ---------- app nav ----------
  const onNav = (v: View) => patch({ view: v, buyingJob: null })
  const onRoom = (room: string) => patch({ roomFilter: room, buyingJob: null })
  const onOpenJobItems = (jobId: string) => patch({ view: 'buying', buyingJob: jobId })
  const clearBuyingJob = () => patch({ buyingJob: null })

  // ---------- drag & drop ----------
  const onDragStart = (e: React.DragEvent, id: string) => {
    patch({ draggedId: id })
    try {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', id)
    } catch {}
  }
  const onDragEnd = () => patch({ draggedId: null, dragOverCol: null })
  const onDragOver = (e: React.DragEvent, col: ColumnId) => {
    e.preventDefault()
    try {
      e.dataTransfer.dropEffect = 'move'
    } catch {}
    if (state.dragOverCol !== col) patch({ dragOverCol: col })
  }
  const onDragLeave = (e: React.DragEvent, col: ColumnId) => {
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node) && state.dragOverCol === col)
      patch({ dragOverCol: null })
  }
  const onDrop = (e: React.DragEvent, col: ColumnId) => {
    e.preventDefault()
    const id = state.draggedId
    if (id)
      patchActive((p) => ({ ...p, jobs: p.jobs.map((j) => (j.id === id ? { ...j, column: col } : j)) }), {
        draggedId: null,
        dragOverCol: null,
      })
    else patch({ dragOverCol: null })
  }

  // ---------- jobs / products mutations ----------
  const onDeleteJob = (id: string) =>
    patchActive((p) => ({ ...p, jobs: p.jobs.filter((j) => j.id !== id) }))
  const onDeleteProduct = (id: string) =>
    patchActive((p) => ({ ...p, products: p.products.filter((x) => x.id !== id) }))
  const onToggleBought = (id: string) =>
    patchActive((p) => ({
      ...p,
      products: p.products.map((x) => (x.id === id ? { ...x, bought: !x.bought } : x)),
    }))

  // ---------- product detail ----------
  const onOpenDetail = (id: string) => patch({ detailId: id })
  const closeDetail = () => patch({ detailId: null })
  const onBuyFromDetail = () => {
    const id = state.detailId
    patchActive((p) => ({ ...p, products: p.products.map((x) => (x.id === id ? { ...x, bought: true } : x)) }), {
      detailId: null,
    })
  }

  // ---------- job detail ----------
  const openJobDetail = (id: string) => patch({ jobDetailId: id, jobDetailEdit: false })
  const closeJobDetail = () => patch({ jobDetailId: null, jobDetailEdit: false, jobDetailDraft: null })
  const startEditJobDetail = () => {
    const j = activeProject().jobs.find((x) => x.id === state.jobDetailId)
    if (!j) return
    patch({
      jobDetailEdit: true,
      jobDetailDraft: {
        title: j.title,
        room: j.room,
        column: j.column,
        cost: j.cost || '',
        contractor: j.contractor || '',
        contact: j.contact || '',
      },
    })
  }
  const cancelEditJobDetail = () => patch({ jobDetailEdit: false, jobDetailDraft: null })
  const onJobDetailField = (f: keyof JobDraft, v: string) =>
    patch((s) => ({ jobDetailDraft: { ...(s.jobDetailDraft as JobDraft), [f]: v } }))
  const saveJobDetail = (e: React.FormEvent) => {
    e.preventDefault()
    const id = state.jobDetailId
    const d = state.jobDetailDraft
    if (!id || !d) return
    patchActive(
      (p) => ({
        ...p,
        jobs: p.jobs.map((j) =>
          j.id === id
            ? {
                ...j,
                title: String(d.title).trim() || j.title,
                room: d.room,
                column: d.column,
                cost: Number(d.cost) || 0,
                contractor: d.contractor.trim() || undefined,
                contact: d.contact.trim() || undefined,
              }
            : j,
        ),
      }),
      { jobDetailEdit: false },
    )
  }

  const onAttention = (action: string, id: string) => {
    if (action === 'product') patch({ detailId: id })
    else patch({ view: 'board', jobDetailId: id, jobDetailEdit: false })
  }

  // ---------- add job / product ----------
  const onAddPrimary = () => {
    if (state.view === 'buying') openProdModal('')
    else openJobModal('ideas')
  }
  const openJobModal = (col: ColumnId) => {
    const rooms = activeProject().rooms
    patch({
      jobModal: true,
      jobForm: { title: '', room: rooms[0] || '', column: col || 'ideas', cost: '', contractor: '' },
    })
  }
  const closeJobModal = () => patch({ jobModal: false })
  const onJobField = (f: keyof JobForm, v: string) =>
    patch((s) => ({ jobForm: { ...s.jobForm, [f]: v } as JobForm }))
  const submitJob = (e: React.FormEvent) => {
    e.preventDefault()
    const f = state.jobForm
    if (!f.title.trim()) return
    const job: Job = {
      id: 'j-' + Date.now(),
      title: f.title.trim(),
      room: f.room,
      column: f.column,
      cost: Number(f.cost) || 0,
      contractor: f.contractor.trim() || undefined,
    }
    patchActive((p) => ({ ...p, jobs: [...p.jobs, job] }), { jobModal: false })
  }

  const knownRetailer = (r?: string) => (r && RETAILERS.includes(r) ? r : null)

  const openProdModal = (link: string) => {
    const rooms = activeProject().rooms
    patch({
      prodModal: true,
      fetchError: null,
      prodForm: { link: link || '', name: '', retailer: RETAILERS[0], room: rooms[0] || '', price: '', target: '' },
    })
  }
  const closeProdModal = () => patch({ prodModal: false, fetchError: null })
  const onProdField = (f: keyof ProdForm, v: string) =>
    patch((s) => ({ prodForm: { ...s.prodForm, [f]: v } }))
  const onPaste = (v: string) => patch({ pasteUrl: v })

  // paste a link → extract details server-side → open the modal prefilled
  const onPasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = state.pasteUrl.trim()
    if (!url) return
    const rooms = activeProject().rooms
    patch({ fetching: true, fetchError: null })
    const data = await extractProduct(url)
    patch({
      fetching: false,
      pasteUrl: '',
      prodModal: true,
      fetchError: data.ok ? null : data.error ?? null,
      prodForm: {
        link: url,
        name: data.name ?? '',
        retailer: knownRetailer(data.retailer) ?? RETAILERS[0],
        room: rooms[0] || '',
        price: data.price != null ? String(data.price) : '',
        target: '',
      },
    })
  }

  // "Fetch from link" inside the modal — fills fields without discarding edits
  const fetchIntoProdForm = async () => {
    const url = state.prodForm.link.trim()
    if (!url) return
    patch({ fetching: true, fetchError: null })
    const data = await extractProduct(url)
    patch((s) => ({
      fetching: false,
      fetchError: data.ok ? null : data.error ?? 'Couldn’t read that page.',
      prodForm: {
        ...s.prodForm,
        name: data.name ?? s.prodForm.name,
        retailer: knownRetailer(data.retailer) ?? s.prodForm.retailer,
        price: data.price != null ? String(data.price) : s.prodForm.price,
      },
    }))
  }

  const submitProd = (e: React.FormEvent) => {
    e.preventDefault()
    const f = state.prodForm
    const price = Number(f.price)
    if (!f.name.trim() || !price) return
    const target = Number(f.target) || price
    const prod: Product = {
      id: 'p-' + Date.now(),
      name: f.name.trim(),
      retailer: f.retailer,
      room: f.room,
      jobId: null,
      bought: false,
      price,
      target,
      history: [price, price],
      link: f.link.trim() || undefined,
    }
    patchActive((p) => ({ ...p, products: [prod, ...p.products] }), { prodModal: false, fetchError: null })
  }

  // re-check a product's live price; reflect any change in price + history
  const refreshProduct = async (id: string) => {
    const prod = activeProject().products.find((p) => p.id === id)
    if (!prod || !prod.link) return
    let already = false
    setState((s) => {
      if (s.checking.includes(id)) {
        already = true
        return s
      }
      return { ...s, checking: [...s.checking, id] }
    })
    if (already) return
    const data = await extractProduct(prod.link)
    setState((s) => ({
      ...s,
      checking: s.checking.filter((c) => c !== id),
      projects: s.projects.map((p) =>
        p.id === s.activeId
          ? {
              ...p,
              products: p.products.map((x) => {
                if (x.id !== id) return x
                if (!data.ok || data.price == null || data.price === x.price) return x
                const history = [...x.history, data.price].slice(-12)
                const backInStock = data.inStock === true ? true : x.backInStock
                return { ...x, price: data.price, history, backInStock }
              }),
            }
          : p,
      ),
    }))
  }

  const refreshAll = async () => {
    const ids = activeProject()
      .products.filter((p) => !p.bought && p.link)
      .map((p) => p.id)
    // Bounded concurrency: refresh several items at once (fast) without firing
    // unbounded parallel requests at retailer sites, and don't let one failed
    // fetch block the rest (allSettled).
    const CONCURRENCY = 3
    for (let i = 0; i < ids.length; i += CONCURRENCY) {
      await Promise.allSettled(ids.slice(i, i + CONCURRENCY).map((id) => refreshProduct(id)))
    }
  }

  // ---------- budget editing ----------
  const openBudgetModal = () => patch({ budgetModal: true, budgetDraft: String(activeProject().budgetTotal || '') })
  const closeBudgetModal = () => patch({ budgetModal: false })
  const onBudgetDraft = (v: string) => patch({ budgetDraft: v.replace(/[^0-9]/g, '').slice(0, 9) })
  const setBudgetDraft = (amt: string) => patch({ budgetDraft: amt })
  const saveBudget = (e: React.FormEvent) => {
    e.preventDefault()
    const v = Number(state.budgetDraft)
    patchActive((p) => ({ ...p, budgetTotal: v > 0 ? v : p.budgetTotal }), { budgetModal: false })
  }

  // ---------- persistence (localStorage) ----------
  // Seed data is used for the very first render (both server and client) so
  // there's no SSR/hydration mismatch. Once mounted, we swap in anything saved
  // from a previous visit.
  //
  // `hydrated` MUST be React state, not a ref: setState only schedules a
  // re-render, so a ref flipped to `true` right after calling setState would
  // let the save-effect below fire on the very same pass — using the stale
  // pre-load (seed) state, because that scheduled update hasn't applied yet —
  // and silently overwrite a real saved project with the seed in localStorage.
  // Using state instead guarantees `hydrated` and the loaded `projects` land
  // together in the same render, so the save-effect only ever runs once both
  // are consistent.
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const loaded = loadState()
    if (loaded) setState((s) => ({ ...s, projects: loaded.projects, activeId: loaded.activeId }))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveState(state.projects, state.activeId)
  }, [hydrated, state.projects, state.activeId])

  // ---------- count-up animation on scope changes ----------
  const countPrev = useRef<Record<string, number>>({})
  const vm = computeApp(state)

  useEffect(() => {
    if (state.stage !== 'app' || state.view !== 'overview') return
    const keys = ['center', 'spent', 'committed', 'third']
    keys.forEach((key) => {
      const el = document.querySelector<HTMLElement>(`[data-count-key="${key}"]`)
      if (!el) return
      const target = parseFloat(el.getAttribute('data-count') || '')
      if (isNaN(target)) {
        delete countPrev.current[key]
        return
      }
      const from = countPrev.current[key] != null ? countPrev.current[key] : target
      if (from === target) {
        countPrev.current[key] = target
        return
      }
      const prefix = el.getAttribute('data-count-prefix') || ''
      const suffix = el.getAttribute('data-count-suffix') || ''
      const currency = el.getAttribute('data-count-currency') || ''
      const dur = 600
      const start = performance.now()
      const ease = (t: number) => 1 - Math.pow(1 - t, 3)
      const format = (n: number) => {
        const neg = n < 0
        const abs = Math.round(Math.abs(n))
        return (neg ? '-' : '') + prefix + currency + abs.toLocaleString('en-GB') + suffix
      }
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1)
        el.textContent = format(from + (target - from) * ease(p))
        if (p < 1) requestAnimationFrame(tick)
        else {
          el.textContent = format(target)
          countPrev.current[key] = target
        }
      }
      requestAnimationFrame(tick)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vm.scope.centerRaw, vm.scope.spentRaw, vm.scope.committedRaw, vm.scope.thirdRaw, state.view, state.activeId, state.stage])

  // ---------- render ----------
  if (state.stage === 'onboarding') {
    return <Onboarding onb={state.onb} setOnb={(onb) => patch({ onb })} onCancel={onbCancel} onFinish={finishOnb} />
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
      <Sidebar
        vm={vm}
        projectMenuOpen={state.projectMenu}
        onToggleProjectMenu={toggleProjectMenu}
        onSelectProject={selectProject}
        onNewProject={newProject}
        onNav={onNav}
        onRoom={onRoom}
      />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AppHeader vm={vm} onAddPrimary={onAddPrimary} onOpenBudget={openBudgetModal} />
        <main style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {vm.isOverview && <Overview vm={vm} onAttention={onAttention} />}
          {vm.isBoard && (
            <Board
              vm={vm}
              onOpenJobDetail={openJobDetail}
              onDeleteJob={onDeleteJob}
              onOpenJobItems={onOpenJobItems}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            />
          )}
          {vm.isBuying && (
            <Shopping
              vm={vm}
              pasteUrl={state.pasteUrl}
              fetching={state.fetching}
              checking={state.checking}
              onPaste={onPaste}
              onPasteSubmit={onPasteSubmit}
              onRoom={onRoom}
              onClearBuyingJob={clearBuyingJob}
              onOpenDetail={onOpenDetail}
              onToggleBought={onToggleBought}
              onDeleteProduct={onDeleteProduct}
              onRefresh={refreshProduct}
              onRefreshAll={refreshAll}
            />
          )}
        </main>
      </div>

      {vm.detailOpen && vm.detail && (
        <ProductDetailModal detail={vm.detail} onClose={closeDetail} onBuy={onBuyFromDetail} />
      )}
      {vm.jobDetailOpen && vm.jobDetail && (
        <JobDetailModal
          jobDetail={vm.jobDetail}
          editing={state.jobDetailEdit}
          draft={state.jobDetailDraft}
          assignableRooms={vm.rooms}
          columns={COLUMNS}
          onClose={closeJobDetail}
          onStartEdit={startEditJobDetail}
          onCancelEdit={cancelEditJobDetail}
          onField={onJobDetailField}
          onSave={saveJobDetail}
        />
      )}
      {state.jobModal && (
        <AddJobModal
          form={state.jobForm}
          assignableRooms={vm.rooms}
          columns={COLUMNS}
          onField={onJobField}
          onSubmit={submitJob}
          onClose={closeJobModal}
        />
      )}
      {state.prodModal && (
        <AddProductModal
          form={state.prodForm}
          assignableRooms={vm.rooms}
          retailers={RETAILERS}
          fetching={state.fetching}
          fetchError={state.fetchError}
          onFetchLink={fetchIntoProdForm}
          onField={onProdField}
          onSubmit={submitProd}
          onClose={closeProdModal}
        />
      )}
      {state.budgetModal && (
        <AdjustBudgetModal
          projectName={vm.projectName}
          draft={state.budgetDraft}
          onDraft={onBudgetDraft}
          onPreset={setBudgetDraft}
          onSave={saveBudget}
          onClose={closeBudgetModal}
        />
      )}
    </div>
  )
}
