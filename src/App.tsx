import React, { useEffect, useMemo, useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { findAppDataFile, readJsonFile, createJsonFile, updateJsonFile } from './googleDrive'
import { loadToken, saveToken, clearToken, loadFileId, saveFileId, clearFileId } from './auth'
import { loadApplications, saveApplications } from './storage'
import Tabs from './components/Tabs'
import Table, { ColumnKey } from './components/Table'
import Tag from './components/Tag'
import { STAGE_ORDER, stageColors, verdictColors } from './data'
import { Application } from './types'
import AddModal from './components/AddModal'

function sortRows(rows: Application[], column: ColumnKey, dir: 'asc' | 'desc') {
    const mul = dir === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => {
        const av = (a as any)[column] ?? ''
        const bv = (b as any)[column] ?? ''
        if (column === 'appliedDate' || column === 'offeredDate') {
            const ad = av ? new Date(av).getTime() : 0
            const bd = bv ? new Date(bv).getTime() : 0
            return (ad - bd) * mul
        }
        return String(av).localeCompare(String(bv)) * mul
    })
}

type ViewKey = 'all' | 'stage' | 'verdict' | 'due'

export default function App() {
    const [view, setView] = useState<ViewKey>('all')
    const [query, setQuery] = useState('')
    const [sort, setSort] = useState<{ column: ColumnKey; dir: 'asc' | 'desc' }>({ column: 'company', dir: 'asc' })
    const [apps, setApps] = useState<Application[]>(() => loadApplications([]))
    const [modalOpen, setModalOpen] = useState(false)
    const [editApp, setEditApp] = useState<Application | null>(null)
    const [infoApp, setInfoApp] = useState<Application | null>(null)
    const [dark, setDark] = useState(true)
    const [driveToken, setDriveToken] = useState('')
    const [driveFileId, setDriveFileId] = useState('')
    const filename = 'job_applications.json'
    const connected = !!driveToken && !!driveFileId
    useEffect(() => {
        document.body.setAttribute('data-theme', 'dark')
        // Try restoring token and file ID from sessionStorage
        const rec = loadToken()
        const cachedFileId = loadFileId()
        if (rec) {
            setDriveToken(rec.accessToken)
            // If we have a cached file ID, try to read immediately
            if (cachedFileId) {
                setDriveFileId(cachedFileId)
                readJsonFile(rec.accessToken, cachedFileId)
                    .then((remote) => setApps(remote as Application[]))
                    .catch(async () => {
                        // If cached ID is stale, re-discover
                        try {
                            const found = await findAppDataFile(rec.accessToken, filename)
                            if (found?.id) {
                                setDriveFileId(found.id)
                                saveFileId(found.id)
                                const remote = await readJsonFile(rec.accessToken, found.id)
                                setApps(remote as Application[])
                            } else {
                                const created = await createJsonFile(rec.accessToken, filename, [])
                                setDriveFileId(created.id)
                                saveFileId(created.id)
                            }
                        } catch (e) {
                            console.error(e)
                        }
                    })
            } else {
                // No cached ID: find or create
                findAppDataFile(rec.accessToken, filename)
                    .then(async (found) => {
                        if (found?.id) {
                            setDriveFileId(found.id)
                            saveFileId(found.id)
                            const remote = await readJsonFile(rec.accessToken, found.id)
                            setApps(remote as Application[])
                        } else {
                            const created = await createJsonFile(rec.accessToken, filename, [])
                            setDriveFileId(created.id)
                            saveFileId(created.id)
                        }
                    })
                    .catch((e) => console.error(e))
            }
        }
    }, [])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        const base = q
            ? apps.filter(
                (r) =>
                    r.company.toLowerCase().includes(q) ||
                    r.position?.toLowerCase().includes(q) ||
                    r.currentStage.toLowerCase().includes(q) ||
                    r.finalVerdict?.toLowerCase().includes(q)
            )
            : apps
        return sortRows(base, sort.column, sort.dir)
    }, [query, sort, apps])

    const toggleSort = (col: ColumnKey) => {
        setSort((s) => (s.column === col ? { column: col, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { column: col, dir: 'asc' }))
    }

    const login = useGoogleLogin({
        scope: 'https://www.googleapis.com/auth/drive.appdata',
        onSuccess: async (tokenResponse) => {
            const token = tokenResponse.access_token
            setDriveToken(token)
            saveToken(token, (tokenResponse as any)?.expires_in ?? 3600)
            try {
                const found = await findAppDataFile(token, filename)
                if (found?.id) {
                    setDriveFileId(found.id)
                    saveFileId(found.id)
                    const remote = await readJsonFile(token, found.id)
                    setApps(remote as Application[])
                    saveApplications(remote as Application[])
                } else {
                    const created = await createJsonFile(token, filename, apps)
                    setDriveFileId(created.id)
                    saveFileId(created.id)
                }
            } catch (e) {
                console.error(e)
            }
        },
        onError: (err) => {
            console.error('Google login error', err)
        },
    })

    async function persistAll(next: Application[]) {
        // Always persist locally (with 7-day TTL)
        saveApplications(next)
        // Optionally patch Drive if connected
        if (driveToken && driveFileId) {
            try {
                await updateJsonFile(driveToken, driveFileId, next)
            } catch (e: any) {
                if (e?.message === 'unauthorized') {
                    setDriveToken('')
                    clearToken()
                }
                console.error(e)
            }
        }
    }

    return (
        <div className="container transition-colors duration-300">
            <div className="header">
                <div className="title-wrap">
                    <div className="title">Switch.io</div>
                    <div className="subtitle"><span className="dot-green" aria-hidden></span>Tracking {apps.length} active opportunities</div>
                </div>
                <div className="kv">
                    <button
                        className="btn-gradient"
                        disabled={!connected}
                        title={connected ? 'Add new job' : 'Connect to Google to add'}
                        onClick={() => {
                            if (!connected) { alert('Please sync with Google to add jobs.'); return }
                            setModalOpen(true)
                        }}
                    >
                        ➕ New Job
                    </button>
                    <button className="btn" onClick={() => login()}>{driveToken ? 'Connected to Google' : 'Sync with Google'}</button>
                    <button
                        className="icon-btn"
                        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                        title={dark ? 'Light Mode' : 'Dark Mode'}
                        onClick={() => {
                            setDark(d => {
                                const next = !d
                                document.body.setAttribute('data-theme', next ? 'dark' : '')
                                return next
                            })
                        }}
                    >
                        {dark ? '☀️' : '🌙'}
                    </button>
                </div>
            </div>

            <div className="command-bar">
                <Tabs value={view} onChange={setView} allCount={apps.length} />
                <input className="search" placeholder="Search companies, stages…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>

            {!connected && (
                <div className="notice" style={{ margin: '8px 0', padding: '8px', background: '#223', borderRadius: 6 }}>
                    Connect to Google to edit. Drive sync is required.
                </div>
            )}

            {view === 'all' && (
                <Table
                    rows={filtered}
                    onSort={toggleSort}
                    sort={sort}
                    onInfo={(app) => setInfoApp(app)}
                    onEdit={(app) => { if (!connected) { alert('Please sync with Google to edit.'); return } setEditApp(app); setModalOpen(true) }}
                    onDelete={(app) => {
                        if (!connected) { alert('Please sync with Google to delete.'); return }
                        if (confirm(`Delete ${app.company}${app.position ? ' – ' + app.position : ''}?`)) {
                            setApps(prev => { const next = prev.filter(a => a.id !== app.id); persistAll(next); return next })
                        }
                    }}
                />
            )}

            {view === 'stage' && (
                <GroupedByStage
                    rows={filtered}
                    onInfo={(app) => setInfoApp(app)}
                    onEdit={(app) => { if (!connected) { alert('Please sync with Google to edit.'); return } setEditApp(app); setModalOpen(true) }}
                    onDelete={(app) => { if (!connected) { alert('Please sync with Google to delete.'); return } if (confirm(`Delete ${app.company}${app.position ? ' – ' + app.position : ''}?`)) { setApps(prev => { const next = prev.filter(a => a.id !== app.id); persistAll(next); return next }) } }}
                />
            )}

            {view === 'verdict' && (
                <GroupedByVerdict
                    rows={filtered}
                    onInfo={(app) => setInfoApp(app)}
                    onEdit={(app) => { if (!connected) { alert('Please sync with Google to edit.'); return } setEditApp(app); setModalOpen(true) }}
                    onDelete={(app) => { if (!connected) { alert('Please sync with Google to delete.'); return } if (confirm(`Delete ${app.company}${app.position ? ' – ' + app.position : ''}?`)) { setApps(prev => { const next = prev.filter(a => a.id !== app.id); persistAll(next); return next }) } }}
                />
            )}

            {view === 'due' && (
                <GroupedByDue
                    rows={filtered}
                    onInfo={(app) => setInfoApp(app)}
                    onEdit={(app) => { if (!connected) { alert('Please sync with Google to edit.'); return } setEditApp(app); setModalOpen(true) }}
                    onDelete={(app) => { if (!connected) { alert('Please sync with Google to delete.'); return } if (confirm(`Delete ${app.company}${app.position ? ' – ' + app.position : ''}?`)) { setApps(prev => { const next = prev.filter(a => a.id !== app.id); persistAll(next); return next }) } }}
                />
            )}

            {/* <div className="footer">Built with React + Vite · Notion-like table UI</div> */}

            <AddModal
                open={modalOpen}
                onClose={() => { setModalOpen(false); setEditApp(null) }}
                initial={editApp || undefined}
                onAdd={(app) => {
                    setApps(prev => {
                        if (!connected) { alert('Please sync with Google to add.'); return prev }
                        const next = [app, ...prev];
                        persistAll(next);
                        return next
                    })
                }}
                onUpdate={(app) => {
                    setApps(prev => {
                        if (!connected) { alert('Please sync with Google to update.'); return prev }
                        const next = prev.map(a => a.id === app.id ? app : a);
                        persistAll(next);
                        return next
                    })
                }}
            />

            {infoApp && (
                <div className="modal-overlay" onClick={() => setInfoApp(null)}>
                    <div className="modal premium" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="title">Notes · {infoApp.company}{infoApp.position ? ` – ${infoApp.position}` : ''}</div>
                            <button className="close" onClick={() => setInfoApp(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ whiteSpace: 'pre-wrap' }}>
                                {infoApp.notes ? infoApp.notes : <span className="placeholder">No notes saved.</span>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function GroupedByStage({ rows, onInfo, onEdit, onDelete }: { rows: Application[]; onInfo: (app: Application) => void; onEdit: (app: Application) => void; onDelete: (app: Application) => void }) {
    const groups = useMemo(() => {
        const map = new Map<string, Application[]>()
        for (const r of rows) {
            const k = r.currentStage
            const arr = map.get(k) ?? []
            arr.push(r)
            map.set(k, arr)
        }
        return map
    }, [rows])

    const ordered = STAGE_ORDER.filter((k) => groups.has(k)).concat([...groups.keys()].filter((k) => !STAGE_ORDER.includes(k)))

    return (
        <div>
            {ordered.map((key) => (
                <div key={key} className="group">
                    <div className="group-title">
                        <Tag label={key} color={stageColors[key] || 'gray'} />
                        <span>· {groups.get(key)?.length ?? 0}</span>
                    </div>
                    <Table rows={groups.get(key)!} onSort={() => { }} sort={{ column: 'company', dir: 'asc' }} onInfo={onInfo} onEdit={onEdit} onDelete={(app) => { if (confirm(`Delete ${app.company}${app.position ? ' – ' + app.position : ''}?`)) { setApps(prev => { const next = prev.filter(a => a.id !== app.id); persistAll(next); return next }) } }} />
                </div>
            ))}
        </div>
    )
}

function GroupedByVerdict({ rows, onInfo, onEdit, onDelete }: { rows: Application[]; onInfo: (app: Application) => void; onEdit: (app: Application) => void; onDelete: (app: Application) => void }) {
    const groups = useMemo(() => {
        const map = new Map<string, Application[]>()
        for (const r of rows) {
            const k = r.finalVerdict || 'Pending'
            const arr = map.get(k) ?? []
            arr.push(r)
            map.set(k, arr)
        }
        return map
    }, [rows])

    const ordered = ['Offered', 'Declined Offer', 'Pending', 'Rejected'].filter((k) => groups.has(k))

    return (
        <div>
            {ordered.map((key) => (
                <div key={key} className="group">
                    <div className="group-title">
                        <Tag label={key} color={verdictColors[key] || 'gray'} />
                        <span>· {groups.get(key)?.length ?? 0}</span>
                    </div>
                    <Table rows={groups.get(key)!} onSort={() => { }} sort={{ column: 'company', dir: 'asc' }} onInfo={onInfo} onEdit={onEdit} onDelete={(app) => { if (confirm(`Delete ${app.company}${app.position ? ' – ' + app.position : ''}?`)) { setApps(prev => { const next = prev.filter(a => a.id !== app.id); persistAll(next); return next }) } }} />
                </div>
            ))}
        </div>
    )
}

function GroupedByDue({ rows, onInfo, onEdit, onDelete }: { rows: Application[]; onInfo: (app: Application) => void; onEdit: (app: Application) => void; onDelete: (app: Application) => void }) {
    const now = new Date()
    const groups = useMemo(() => {
        const upcoming: Application[] = []
        const past: Application[] = []
        const none: Application[] = []
        for (const r of rows) {
            if (!r.dueDate) { none.push(r); continue }
            const d = new Date(r.dueDate)
            if (d.getTime() >= now.getTime()) upcoming.push(r)
            else past.push(r)
        }
        return { upcoming, past, none }
    }, [rows])

    return (
        <div>
            <div className="group">
                <div className="group-title"><Tag label="Upcoming" color="green" />· {groups.upcoming.length}</div>
                <Table rows={groups.upcoming} onSort={() => { }} sort={{ column: 'dueDate' as ColumnKey, dir: 'asc' }} onInfo={onInfo} onEdit={onEdit} onDelete={(app) => { if (confirm(`Delete ${app.company}${app.position ? ' – ' + app.position : ''}?`)) { setApps(prev => { const next = prev.filter(a => a.id !== app.id); persistAll(next); return next }) } }} />
            </div>
            <div className="group">
                <div className="group-title"><Tag label="Past" color="purple" />· {groups.past.length}</div>
                <Table rows={groups.past} onSort={() => { }} sort={{ column: 'dueDate' as ColumnKey, dir: 'asc' }} onInfo={onInfo} onEdit={onEdit} onDelete={(app) => { if (confirm(`Delete ${app.company}${app.position ? ' – ' + app.position : ''}?`)) { setApps(prev => { const next = prev.filter(a => a.id !== app.id); persistAll(next); return next }) } }} />
            </div>
            <div className="group">
                <div className="group-title"><Tag label="No Due Date" color="gray" />· {groups.none.length}</div>
                <Table rows={groups.none} onSort={() => { }} sort={{ column: 'company', dir: 'asc' }} onInfo={onInfo} onEdit={onEdit} onDelete={(app) => { if (confirm(`Delete ${app.company}${app.position ? ' – ' + app.position : ''}?`)) { setApps(prev => { const next = prev.filter(a => a.id !== app.id); persistAll(next); return next }) } }} />
            </div>
        </div>
    )
}
