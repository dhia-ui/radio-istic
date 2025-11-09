"use client"
import { onCLS, onINP, onLCP, onTTFB, onFCP } from 'web-vitals'
import { useEffect } from 'react'

export function MetricsReporter() {
  useEffect(() => {
    function report(metric: any) {
      // Send metrics to API endpoint
      fetch('/api/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
        })
      }).catch(() => {})
    }
    onCLS(report)
    onINP(report)
    onLCP(report)
    onTTFB(report)
    onFCP(report)
  }, [])
  return null
}
