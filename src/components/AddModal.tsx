import React, { useEffect, useState } from 'react'
import { Application, Stage, Verdict, RoundType } from '../types'
import { stageColors } from '../data'

export default function AddModal({ open, onClose, onAdd, onUpdate, initial }: {
    open: boolean;
    onClose: () => void;
    onAdd?: (app: Application) => void;
    onUpdate?: (app: Application) => void;
    initial?: Application | null;
}) {
    const [company, setCompany] = useState('')
    const [position, setPosition] = useState('')
    const [team, setTeam] = useState('')
    const [currentStage, setCurrentStage] = useState<Stage | string>('Applied')
    const [roundType, setRoundType] = useState<RoundType | string>('')
    const [appliedDate, setAppliedDate] = useState('')
    const [offeredDate, setOfferedDate] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [finalVerdict, setFinalVerdict] = useState<Verdict | string>('')
    const [emoji, setEmoji] = useState('')
    const [notes, setNotes] = useState('')
    const [recruiter, setRecruiter] = useState('')
    const [referrer, setReferrer] = useState('')
    const [links, setLinks] = useState('')

    const reset = () => {
        setCompany(''); setPosition(''); setTeam(''); setCurrentStage('Applied'); setRoundType(''); setAppliedDate(''); setOfferedDate(''); setDueDate(''); setFinalVerdict(''); setEmoji(''); setNotes(''); setRecruiter(''); setReferrer(''); setLinks('')
    }

    useEffect(() => {
        if (open && initial) {
            setCompany(initial.company || '')
            setPosition(initial.position || '')
            setTeam(initial.team || '')
            setCurrentStage(initial.currentStage || 'Applied')
            setRoundType(initial.roundType || '')
            setAppliedDate(initial.appliedDate || '')
            setOfferedDate(initial.offeredDate || '')
            setDueDate(initial.dueDate || '')
            setFinalVerdict(initial.finalVerdict || '')
            setEmoji(initial.emoji || '')
            setNotes(initial.notes || '')
            // recruiter/referrer/links not in type; keep as-is if used later
        } else if (open && !initial) {
            reset()
        }
    }, [open, initial])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!company.trim()) return
        const id = initial?.id || `${company.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
        const app: Application = {
            id,
            company: company.trim(),
            emoji: emoji || undefined,
            position: position || undefined,
            team: team || undefined,
            currentStage,
            roundType: roundType || undefined,
            appliedDate: appliedDate || undefined,
            offeredDate: offeredDate || undefined,
            dueDate: dueDate || undefined,
            finalVerdict: finalVerdict || undefined,
            notes: notes || undefined,
        }
        if (initial && onUpdate) onUpdate(app)
        else if (onAdd) onAdd(app)
        reset()
        onClose()
    }

    if (!open) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal premium" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="title">{initial ? 'Edit Application' : 'Add Application'}</div>
                    <button className="close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-body">
                    {/* Core Info (Company, Role) */}
                    <div className="section">
                        <div className="grid-2">
                            <div className="field">
                                <label>Company</label>
                                <input className="input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Akasa Air" required />
                            </div>
                            <div className="field">
                                <label>Emoji/Logo</label>
                                <input className="input" value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="🔎" />
                            </div>
                            <div className="field">
                                <label>Position</label>
                                <input className="input" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Software Engineer" />
                            </div>
                            <div className="field">
                                <label>Team/Division</label>
                                <input className="input" value={team} onChange={(e) => setTeam(e.target.value)} placeholder="E-Commerce" />
                            </div>

                            <div className="field">
                                <label>Current Stage</label>
                                <select className="select" value={currentStage} onChange={(e) => setCurrentStage(e.target.value)}>
                                    {Object.keys(stageColors).map(k => <option key={k} value={k}>{k}</option>)}
                                </select>
                            </div>
                            <div className="field">
                                <label>Round Type</label>
                                <input className="input" value={roundType} onChange={(e) => setRoundType(e.target.value)} placeholder="e.g., DSA, HLD" />
                            </div>
                        </div>
                    </div>

                    {/* Logistics (Status & Dates, Link) */}
                    <div className="section">
                        <div className="logistics-grid">
                            <div className="field">
                                <label>Status</label>
                                <select className="select" value={finalVerdict} onChange={(e) => setFinalVerdict(e.target.value)}>
                                    <option value="">—</option>
                                    <option value="Offered">Offered</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Declined Offer">Declined Offer</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                            <div className="field">
                                <label>Applied Date</label>
                                <div className="input-with-icon">
                                    <span className="icon" aria-hidden>📅</span>
                                    <input className="input has-icon" type="date" value={appliedDate} onChange={(e) => setAppliedDate(e.target.value)} />
                                </div>
                            </div>
                            <div className="field">
                                <label>Next Action (Due)</label>
                                <div className="input-with-icon">
                                    <span className="icon" aria-hidden>📅</span>
                                    <input className="input has-icon" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                                </div>
                            </div>

                            {/* Link full width */}
                            <div className="field job-link-container">
                                <label>Job Link</label>
                                <div className="input-with-icon">
                                    <span className="icon" aria-hidden>🔗</span>
                                    <input className="input has-icon" value={links} onChange={(e) => setLinks(e.target.value)} placeholder="URL" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* People & Notes */}
                    <div className="section">
                        <div className="grid-2">
                            <div className="field">
                                <label>Recruiter</label>
                                <div className="input-with-icon">
                                    <span className="icon" aria-hidden>👤</span>
                                    <input className="input has-icon" value={recruiter} onChange={(e) => setRecruiter(e.target.value)} placeholder="Name" />
                                </div>
                            </div>
                            <div className="field">
                                <label>Referrer</label>
                                <div className="input-with-icon">
                                    <span className="icon" aria-hidden>👤</span>
                                    <input className="input has-icon" value={referrer} onChange={(e) => setReferrer(e.target.value)} placeholder="Name" />
                                </div>
                            </div>
                            <div className="field col-span-2">
                                <label>Notes</label>
                                <textarea className="input" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Interview notes, what went well, improvements" />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="btn-success">{initial ? 'Save Changes' : 'Add Application'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
