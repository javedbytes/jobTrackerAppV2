import React from 'react'
import { Application } from '../types'
import Tag from './Tag'
import { stageColors, verdictColors } from '../data'

export type ColumnKey =
    | 'company'
    | 'currentStage'
    | 'roundType'
    | 'appliedDate'
    | 'offeredDate'
    | 'finalVerdict'

export default function Table({
    rows,
    onSort,
    sort,
    onInfo,
    onEdit,
    onDelete,
}: {
    rows: Application[]
    onSort: (col: ColumnKey) => void
    sort: { column: ColumnKey; dir: 'asc' | 'desc' }
    onInfo?: (app: Application) => void
    onEdit?: (app: Application) => void
    onDelete?: (app: Application) => void
}) {
    const headers: { key: ColumnKey; label: string; width?: number }[] = [
        { key: 'company', label: 'Company' },
        { key: 'currentStage', label: 'Current Stage' },
        { key: 'roundType', label: 'Round Type' },
        { key: 'appliedDate', label: 'Date' },
        { key: 'offeredDate', label: 'Offered Date' },
        { key: 'finalVerdict', label: 'Final Verdict' },
    ]

    const arrow = (key: ColumnKey) => (sort.column === key ? (sort.dir === 'asc' ? '▲' : '▼') : '')

    return (
        <div className="table-wrapper">
            <div className="card shadow-sm border-gray-200 transition-colors duration-300">
                <table className="table" role="table">
                    <thead>
                        <tr>
                            {headers.map(h => (
                                <th key={h.key} style={{ width: h.width }}>
                                    <button className="sort-btn" onClick={() => onSort(h.key)}>
                                        <span>{h.label}</span>
                                        {arrow(h.key) && <span className="sort-arrow" aria-hidden>{arrow(h.key)}</span>}
                                    </button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(r => (
                            <tr key={r.id} className="row">
                                <td className="company-cell">
                                    <div className="company">
                                        {r.emoji && <span className="emoji" aria-hidden>{r.emoji}</span>}
                                        <div className="company-text">
                                            <div className="title">{r.company}</div>
                                            {(r.position || r.team) && (
                                                <div className="sub"><strong>{r.position ?? ''}</strong>{r.team ? <span className="team"> · {r.team}</span> : null}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row-actions" role="group" aria-label="Row actions">
                                        <button type="button" className="action-icon info" aria-label="View details" title="View details" onClick={() => onInfo?.(r)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4h-2V7h2v6Z" />
                                            </svg>
                                        </button>
                                        <button type="button" className="action-icon edit" aria-label="Edit" title="Edit" onClick={() => onEdit?.(r)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm18.71-11.04a1.004 1.004 0 0 0 0-1.42l-2.5-2.5a1.004 1.004 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.99-1.66Z" />
                                            </svg>
                                        </button>
                                        <button type="button" className="action-icon delete" aria-label="Delete" title="Delete" onClick={() => onDelete?.(r)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                                <path d="M6 7h12v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7Zm3-4h6l1 1h4v2H4V4h4l1-1Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    {renderStageTag(r)}
                                </td>
                                <td>{r.roundType && <span className="pill outline">{r.roundType}</span>}</td>
                                <td>{formatAppliedCell(r)}</td>
                                <td>{formatOfferedCell(r)}</td>
                                <td>{r.finalVerdict ? <Tag label={r.finalVerdict} color={verdictColors[r.finalVerdict] || 'gray'} /> : <span className="placeholder">—</span>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function formatDateShort(d?: string): React.ReactNode {
    if (!d) return <span className="placeholder">—</span>
    try {
        const dt = new Date(d)
        return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
    } catch {
        return d
    }
}

function formatAppliedCell(r: Application): React.ReactNode {
    if (!r.appliedDate) return <span className="placeholder">—</span>
    return formatDateShort(r.appliedDate)
}

function isArchived(r: Application): boolean {
    const v = r.finalVerdict || ''
    return ['Rejected', 'Declined Offer', 'Accept Offer'].includes(v)
}

function renderStageTag(r: Application): React.ReactNode {
    if (isArchived(r)) {
        return <Tag label="Closed" color={stageColors['Discussion'] ? 'gray' : 'gray'} />
    }
    return <Tag label={r.currentStage} color={stageColors[r.currentStage] || 'gray'} />
}

function formatOfferedCell(r: Application): React.ReactNode {
    const v = r.finalVerdict || ''
    const show = ['Offered', 'Accept Offer'].includes(v)
    return show ? formatDateShort(r.offeredDate) : <span className="placeholder">—</span>
}

