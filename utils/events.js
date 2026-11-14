import { API_URL } from "./apiConfig.js";

const CACHE_DURATION_MS = 5 * 60 * 1000;

let cachedEvents = null;
let cachedAt = 0;
let pendingRequest = null;

export const getCachedEvents = () =>
  cachedEvents !== null && Date.now() - cachedAt < CACHE_DURATION_MS
    ? cachedEvents
    : null;

export const getEvents = () => {
  const cached = getCachedEvents();
  if (cached !== null) return Promise.resolve(cached);
  if (pendingRequest) return pendingRequest;

  pendingRequest = fetch(`${API_URL}/events`, {
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }
      return response.json();
    })
    .then((events) => {
      if (!Array.isArray(events)) {
        throw new Error("Invalid events response: expected an array");
      }
      cachedEvents = events;
      cachedAt = Date.now();
      return events;
    })
    .finally(() => {
      pendingRequest = null;
    });

  return pendingRequest;
};
