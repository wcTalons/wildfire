chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create('../main.html', {
    id: "dnd_management",
    bounds: {
      width: 1280,
      height: 800
    },
    resizable: false,
    frame: 'none'
  });
});

chrome.runtime.onInstalled.addListener(function() {
  console.log('installed');
});

chrome.runtime.onSuspend.addListener(function() {
  // Do some simple clean-up tasks.
});