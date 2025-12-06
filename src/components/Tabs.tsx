import React from 'react'

type TabKey = 'all' | 'stage' | 'verdict' | 'due'

export default function Tabs({ value, onChange, allCount }: { value: TabKey; onChange: (v: TabKey) => void; allCount?: number }) {
    const tabs: { key: TabKey; label: string }[] = [
        { key: 'all', label: 'All Applications' },
        { key: 'stage', label: 'By Stage' },
        { key: 'verdict', label: 'By Verdict' },
        { key: 'due', label: 'By Due Dates' },
    ]
    return (
        <div className="tabs underlined" role="tablist">
            {tabs.map(t => (
                <button
                    key={t.key}
                    className={`tab ${value === t.key ? 'active' : ''}`}
                    role="tab"
                    aria-selected={value === t.key}
                    onClick={() => onChange(t.key)}
                >
                    {t.label}
                    {t.key === 'all' && typeof allCount === 'number' && (
                        <span className="tab-badge" aria-hidden> {allCount}</span>
                    )}
                </button>
            ))}
        </div>
    )
}
