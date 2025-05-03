export const scrollToElement = (elementId) => {
  // Get the element by ID (our case) or selector
  const element =
    typeof elementId === "string"
      ? document.querySelector(`[data-id="${elementId}"]`)
      : elementId;

  if (!element) return;

  // Find the parent event box for better positioning
  const eventBox = element.closest(".event-box");
  if (!eventBox) return;

  // Calculate position with offset from top of viewport
  const rect = eventBox.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const topPosition = rect.top + scrollTop - 80; // 80px from top of viewport

  // Scroll with smooth behavior
  window.scrollTo({
    top: topPosition,
    behavior: "smooth",
  });
};
