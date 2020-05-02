## Setup

Install dependencies.

`$ npm ci`

Run the server.

`$ npm run start:watch`

Build the project, generates artifacts in `/dist` folder.

`$ npm run build`

## Debugging in VS Code

In VS Code, open the command palette.

`Cmd + Shift + P`

Select `Debug: Toggle Auto Attach`. You should see `Auto Attach: On` on the bottom bar.

Open a terminal in VS Code.

Run `npm run start:watch` in our terminal and VS Code will automatically start to debug.

See https://code.visualstudio.com/updates/v1_22#_node-debugging for debugging tips.

## Gotchas

`Starting inspector on 127.0.0.1:5858 failed: address already in use`

The debugger process didn't detach after you attached, kill the process manually.

`$ npm run kill-debugger`
