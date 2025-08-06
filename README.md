# 🧩 Team Chat Interface

A reusable, modular React component for building real-time team chat experiences in dashboards, internal tools, or collaborative applications. Designed with flexibility in mind and styled using TailwindCSS and Radix UI.

---

## ✨ Features

- ✅ Real-time message streaming support
- ✅ Session-based chat with message history
- ✅ Custom team service integration
- ✅ VNC support via iframe
- ✅ File upload with progress
- ✅ Modular and themeable (via TailwindCSS)
- ✅ Pluggable store hooks (`useAuthStore`, `useToast`, etc.)

---

## 🚀 Installation

```bash
# Using Yarn
yarn add team-chat-interface

# Or using NPM
npm install team-chat-interface
````

If you are using it locally:

```json
"dependencies": {
  "team-chat-interface": "file:../team-chat-interface"
}
```

Then:

```bash
yarn install
```

---

## 📦 Usage

```tsx
import { TeamChatInterface } from 'team-chat-interface';

<TeamChatInterface
  teamId="your-team-id"
  initialSessionId="optional-session-id"
  initialMessage="optional-initial-message"
  onSessionChange={(sessionId) => console.log(sessionId)}
  onMessageReceived={() => console.log("New message")}
  isHomeTeam={true}
  setVncUrl={(url) => console.log("VNC URL:", url)}
  setIsIframeOpen={(open) => console.log("Iframe open:", open)}
  teamService={teamService}
  useAuthStore={useAuthStore}
  useCreditStore={useCreditStore}
  useToast={useToast}
/>
```

---

## 🧪 Props

| Name                | Type                                          | Required | Description                       |
| ------------------- | --------------------------------------------- | -------- | --------------------------------- |
| `teamId`            | `string`                                      | ✅        | ID of the team                    |
| `initialSessionId`  | `string`                                      | ❌        | Optionally resume a session       |
| `initialMessage`    | `string \| null`                              | ❌        | Prefill a message                 |
| `onSessionChange`   | `(sessionId: string) => void`                 | ❌        | Called when a new session starts  |
| `onMessageReceived` | `() => void`                                  | ❌        | Called when a message is received |
| `isHomeTeam`        | `boolean`                                     | ❌        | Optional team context flag        |
| `setVncUrl`         | `(url: string) => void`                       | ✅        | Set the VNC iframe URL            |
| `setIsIframeOpen`   | `(open: boolean) => void`                     | ✅        | Show/hide the iframe              |
| `teamService`       | `TeamService`                                 | ✅        | API service object (injected)     |
| `useAuthStore`      | `() => { user: User \| null }`                | ✅        | Auth store hook                   |
| `useCreditStore`    | `() => { fetchBalance: () => Promise<void> }` | ✅        | Credit store hook                 |
| `useToast`          | `() => { showToast: (msg: string) => void }`  | ✅        | Toast hook for feedback           |

---

## 🧱 Tech Stack

* React 18/19
* TailwindCSS
* Radix UI
* Zustand (expected in injected stores)
* TypeScript
* tsup (build tool)

---

## 🛠 Development

To build the module:

```bash
yarn build
```

To run in watch mode:

```bash
yarn dev
```

