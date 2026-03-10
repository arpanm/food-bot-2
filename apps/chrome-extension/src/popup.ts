/**
 * Popup script - runs when the user clicks the extension icon
 */
const statusEl = document.getElementById('status');
if (statusEl) {
  statusEl.textContent = 'Extension is active. Workflows run in the background.';
}
