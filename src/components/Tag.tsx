import React from 'react'

export default function Tag({ label, color }: { label: string; color?: string }) {
    const cls = `pill ${color ?? 'gray'}`
    return <span className={cls}>{label}</span>
}
