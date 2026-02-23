/**
 * Food Bot - Chrome extension background script
 * Polls workflow-service for workflow JSON and coordinates execution
 */
chrome.runtime.onInstalled.addListener(() => {
  console.log('Food Bot Workflow Executor installed');
});
