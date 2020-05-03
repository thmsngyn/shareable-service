## Description

Backend service to power the Shareable frontend.

Built with Express and MongoDB, written in Typescript.

## Requirements

- NPM
- Docker (version 19.03.8)
- docker-compose (version 1.25.4)

## Setup

Install dependencies.

`$ npm ci`

Run the server.

`$ npm run start:watch`

Build the project, generates artifacts in `/dist` folder.

`$ npm run build`

Optionally tear down containers.

`$ npm run clean-containers`

## Debugging in VS Code

In VS Code, open the command palette.

`Cmd + Shift + P`

Select `Debug: Toggle Auto Attach`. You should see `Auto Attach: On` on the bottom bar.

Open a terminal in VS Code.

Run `npm run start:watch` in our terminal and VS Code will automatically start to debug.

See https://code.visualstudio.com/updates/v1_22#_node-debugging for debugging tips.

## View Swagger docs

Visit `https://hostname/api-docs`, ie. `http://localhost:4000/api-docs`.

## Gotchas

- `Starting inspector on 127.0.0.1:5858 failed: address already in use`

  The debugger process didn't detach after you attached, kill the process manually.

  `$ npm run kill-debugger`

- View available containers. See https://docs.docker.com/engine/reference/commandline/cli/ for more info.

  `$ docker ps`
