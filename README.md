# Multi-Modal AI Agent

A modern, responsive, and powerful AI chat agent built with Next.js, Vercel AI SDK, and Tailwind CSS v4. This agent supports multi-modal interactions, allowing users to send text, images, and PDF documents for processing.

## Features

- **Multi-Modal Support**: Chat with AI using text, images, and PDFs.
- **Rich File Previews**: In-chat previews for images and full-featured PDF viewing.
- **Modern UI**: A clean, borderless, and responsive interface using Tailwind CSS v4.
- **Streaming Responses**: Real-time AI response streaming for a better user experience.
- **Type-Safe**: Built entirely with TypeScript for better developer experience and reliability.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/docs) (`ai`, `@ai-sdk/react`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v22+ recommended)
- [pnpm](https://pnpm.io/) (v8+ recommended)

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd multi-modal-agent
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your API key:

   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` with your actual credentials:

   ```env
   AI_GATEWAY_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**:

   ```bash
   pnpm dev
   ```

5. **Open the application**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/api/chat/route.ts`: API route handling the AI chat logic.
- `app/page.tsx`: Main chat interface.
- `components/ChatForm.tsx`: Custom chat input with file attachment support.
- `components/MessagePart.tsx`: Component for rendering different message parts (text, image, PDF).
- `lib/chats.ts`: Chat-related utility functions.
- `lib/file.ts`: File processing and data URL conversion utilities.

## Setup

To ensure the agent works correctly, you need:

- **API Access**: An active API key from your AI provider.
- **Environment**: The `AI_GATEWAY_API_KEY` must be set in your `.env.local`.

## Development

- `pnpm dev`: Start development server.
- `pnpm build`: Create an optimized production build.
- `pnpm lint`: Run ESLint for code quality checks.
