# Mordor Management System

A dark-themed enterprise management application for Sauron's forces, built with React 19, TypeScript, Vite, and [Ignite UI for React](https://www.infragistics.com/products/ignite-ui-react).

## Origin

This application was created entirely by **GitHub Copilot** (powered by **Claude Sonnet 4.6**) from a single prompt:

> *"I'm Sauron, the Dark Lord, and I want to create an application to manage Mordor, and the puppet states I control, like Isengard. Even though I have no intention of invading the Middle Earth, I want to be able to get quick reports from my generals, to have an overview of the battalions they control, their numbers, morale, health and what is the primary race of solders they consist of. I want to have an org chart of my generals and lieutenants. I also want to keep track of my food suppliers availability and food production, my armory suppliers and smithing production by location. Also I want quick access to my spy network reports with highlights of items regarding the One Ring."*

From that prompt, Copilot autonomously designed and implemented the full application — data models, page layout, navigation, six feature pages, a login-gated commander report portal, and all styling — with no manual coding required.

## Features

- **Dark Throne** — Command overview dashboard with KPI strip (total warriors, battalions, ring intel, critical alerts) and summary cards for all departments
- **Military Command** — Battalion roster with realm filters, morale/health progress bars, and status chips
- **Order of Command** — Full org chart tree (Sauron → Witch-king → Gothmog → …) built with `IgrTree`
- **Provisions** — Food supplier cards with availability-level filtering
- **Armories & Forges** — Forge cards with production status and daily output meters
- **Eye of Sauron** — Intelligence reports accordion with urgency filtering and Ring intel highlighting
- **Commander Reports** — Login-gated portal where every member of the org chart can submit activity reports (achievements, failures, progress) using React 19 `useActionState` and `useOptimistic`

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| UI components | Ignite UI for React (`igniteui-react`) |
| Theme | Dark Indigo (`igniteui-webcomponents/themes/dark/indigo.css`) |
| Router | React Router v7 |
| AI model | GitHub Copilot / Claude Sonnet 4.6 |

This project was scaffolded with [Ignite UI CLI](https://github.com/IgniteUI/igniteui-cli) version 15.0.0-rc.0.

## AI Tooling

Beyond the base model, Copilot used a suite of specialised tools to build this application correctly and efficiently:

### Skills (context injected into the agent)
- **`igniteui-react-components`** — Provided component selection guidance, JSX patterns, event handling, ref usage, and TypeScript integration for Ignite UI for React. Used throughout to pick the right component for each UI pattern (e.g. `IgrTree` for the org chart, `IgrAccordion` for intelligence reports, `IgrLinearProgress` for morale/health meters).
- **`igniteui-react-customize-theme`** — Covered CSS custom properties, Sass theming, and component-level overrides. Informed the dark Indigo theme setup and scoped styling decisions.
- **`igniteui-react-optimize-bundle-size`** — Guided tree-shaking configuration and lazy-loading strategies to keep the production bundle lean.

### MCP Servers (live tool calls during generation)
- **[Ignite UI CLI MCP](https://github.com/IgniteUI/igniteui-cli)** (`mcp_igniteui-cli_*`) — Provided real-time access to the full Ignite UI for React component catalogue (312 components), documentation lookup, API reference, and project setup guides. Used to verify component APIs before writing JSX.
- **[Ignite UI Theming MCP](https://www.infragistics.com/products/ignite-ui-react/react/components/theming)** (`mcp_igniteui-them_*`) — Offered theme generation tools for palettes, typography, elevations, and component-level design token overrides. Used to validate theme configuration against the dark Indigo preset.

## Development server

Run `ig start` to build the application, start a web server and open the application in the default browser. <br>
The default serving port is `http://localhost:3003/`. Default serving port can be configured in `ignite-ui-cli.json` via `defaultProp` property.

## Build

Run `ig build` to build the application into an output directory.

## Step by step mode

If you want to get a guided experience through the available options, you can initialize the step by step mode that will help you to create and setup your new application, as well as update a project previously created with the Ignite UI CLI. To start the guide, simply run the `ig` command.

## List templates

The `ig list` command lists all available templates for this project.

## Adding components

Add a new component or template to the project passing component ID and choosing a name.

`ig add <component/template> <component_name>`

The ID matches either a component ("grid", "category-chart", etc) or a predefined template. Predefined templates can provide either multiple components or fulfilling a specific use case like "form-validation", "master-detail" and so on.

## Running unit tests

Run `ig test` to execute the unit tests.

## Commands Help

`ig help` lists the available commands and provides a brief description of what they do.

## Learn More

To get more help on the IgniteUI CLI go check out the [IgniteUI CLI Wiki](https://github.com/IgniteUI/igniteui-cli/wiki).

Learn more about Vite features in the [Vite documentation](https://vitejs.dev/guide/).

To learn React, check out the [React documentation](https://reactjs.org/).



