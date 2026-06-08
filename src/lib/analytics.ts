// src/lib/analytics.ts

type EventName =
  | 'filter_change'
  | 'card_click'
  | 'detail_view'
  | 'back_navigate'

interface AnalyticsEvent {
  name: EventName
  properties?: Record<string, string | number>
}

const track = (event: AnalyticsEvent) => {
  if (import.meta.env.DEV) {
    console.debug(`[Analytics] ${event.name}`, event.properties ?? {})
  }
}

export const analytics = {
  filterChange: (dimension: string, value: string) =>
    track({ name: 'filter_change', properties: { dimension, value } }),

  cardClick: (travelId: string, travelTitle: string) =>
    track({ name: 'card_click', properties: { travelId, travelTitle } }),

  detailView: (travelId: string) =>
    track({ name: 'detail_view', properties: { travelId } }),

  backNavigate: (from: string) =>
    track({ name: 'back_navigate', properties: { from } }),
}
