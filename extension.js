const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

function activate(context) {
  console.log('Congratulations, your extension "Focus++" is now active!');

  let disposable = vscode.commands.registerCommand('focus-plus-plus.openWebview', function () {
    const panel = vscode.window.createWebviewPanel(
      'focusPlusPlusWebview', 
      'Focus++', 
      vscode.ViewColumn.One, 
      { enableScripts: true }
    );

    const htmlPath = path.join(context.extensionPath, 'webview.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    panel.webview.html = htmlContent;

    panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case 'startExercise':
            handleStartExercise(message.settings, context);
            return;
          case 'startPomodoro':
            openPomodoroWebview(context);
            return;
          case 'startStopwatch':
            openStopwatchWebview(context);
            return;
          case 'startTimer':
            openTimerWebview(context);
            return;
          case 'startWorldClock':
            openWorldClockWebview(context);
            return;
        }
      },
      undefined,
      context.subscriptions
    );
  });

  context.subscriptions.push(disposable);
}

function handleStartExercise(settings, context) {
  context.globalState.update('exerciseSettings', settings);
  startExerciseInterval(settings, context);
}

function startExerciseInterval(settings, context) {
  const interval = parseInt(settings.frequency, 10) * 60000; // convert to milliseconds

  setInterval(() => {
    const currentSettings = context.globalState.get('exerciseSettings');
    if (currentSettings) {
      // Pause timer if any and show exercise webview
      openExerciseWebview(currentSettings, context);
    }
  }, interval);
}

function openExerciseWebview(settings, context) {
  const panel = vscode.window.createWebviewPanel(
    'exerciseWebview',
    'Exercise Break',
    vscode.ViewColumn.One,
    { enableScripts: true }
  );

  const exercises = [];
  if (settings.backPain) exercises.push('Back Pain');
  if (settings.neckPain) exercises.push('Neck Pain');
  if (settings.eyeStrain) exercises.push('Eye Strain');
  if (settings.carpalTunnel) exercises.push('Carpal Tunnel');

  panel.webview.html = getExerciseWebviewContent(exercises);
}

function getExerciseWebviewContent(exercises) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercise Break</title>
  </head>
  <body>
    <h1>Exercise Break</h1>
    <p>Time for a quick exercise break! Here are some exercises for you:</p>
    <ul>
      ${exercises.map(exercise => `<li>${exercise} - [Video link here]</li>`).join('')}
    </ul>
  </body>
  </html>`;
}

function openPomodoroWebview(context) {
  const panel = vscode.window.createWebviewPanel(
    'pomodoroWebview',
    'Pomodoro Timer',
    vscode.ViewColumn.One,
    { enableScripts: true }
  );

  panel.webview.html = getPomodoroWebviewContent();
}

function getPomodoroWebviewContent() {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pomodoro Timer</title>
  </head>
  <body>
    <h1>Pomodoro Timer</h1>
    <p>Pomodoro timer with relevant animation.</p>
    <!-- Add Pomodoro Timer HTML and JavaScript here -->
  </body>
  </html>`;
}

function openStopwatchWebview(context) {
  const panel = vscode.window.createWebviewPanel(
    'stopwatchWebview',
    'Stopwatch',
    vscode.ViewColumn.One,
    { enableScripts: true }
  );

  panel.webview.html = getStopwatchWebviewContent();
}

function getStopwatchWebviewContent() {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stopwatch</title>
  </head>
  <body>
    <h1>Stopwatch</h1>
    <p>Stopwatch showing hours, minutes, and seconds with stop and lap buttons.</p>
    <!-- Add Stopwatch HTML and JavaScript here -->
  </body>
  </html>`;
}

function openTimerWebview(context) {
  const panel = vscode.window.createWebviewPanel(
    'timerWebview',
    'Timer',
    vscode.ViewColumn.One,
    { enableScripts: true }
  );

  panel.webview.html = getTimerWebviewContent();
}

function getTimerWebviewContent() {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Timer</title>
  </head>
  <body>
    <h1>Timer</h1>
    <p>Countdown timer.</p>
    <!-- Add Timer HTML and JavaScript here -->
  </body>
  </html>`;
}

function openWorldClockWebview(context) {
  const panel = vscode.window.createWebviewPanel(
    'worldClockWebview',
    'World Clock',
    vscode.ViewColumn.One,
    { enableScripts: true }
  );

  panel.webview.html = getWorldClockWebviewContent();
}

function getWorldClockWebviewContent() {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>World Clock</title>
  </head>
  <body>
    <h1>World Clock</h1>
    <p>World clock with different time zones.</p>
    <!-- Add World Clock HTML and JavaScript here -->
  </body>
  </html>`;
}

exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
