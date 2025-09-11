---
title: "AI-Powered Elixir Development with Ampcode"
description: "Learn how to integrate AI assistance directly into your Elixir workflow using Ampcode in both IEx console and Livebook environments"
published: 2025-09-08
tags: ["elixir", "ai", "ampcode", "livebook", "iex", "development-tools"]
toc: true
coverImage:
  src: './cover.png'
  alt: 'AI-powered Elixir development with Ampcode in IEx and Livebook environments'
---
## What is Amp?

Amp is an agentic coding tool by Sourcegraph. Install it from the [manual](https://ampcode.com/manual#install). You get $10 USD free usage, then pay-as-you-go.

https://github.com/sourcegraph/amp


## IEx Integration

Put the Amp configuration in `~/.iex.exs` (global) or `.iex.exs` (project-local). IEx loads the first one it finds.

Complete configuration:
https://gist.github.com/llk23r/5ee15677ac7e177f33dfbee8e7a96045

Start IEx:

```bash
iex -S mix
```

You'll see:

```bash
❯ iex
Erlang/OTP 28 [erts-16.0.1] [source] [64-bit] [smp:10:10] [ds:10:10:10] [async-threads:1] [jit] [dtrace]

Interactive Elixir (1.18.4) - press Ctrl+C to exit (type h() ENTER for help)
🚀 Amp CLI loaded

Basic usage:
  q()                    - Ask a question (clean output)
  q("thread_id")         - Ask in specific thread

Livebook-friendly (no interactive input):
  q_livebook(prompt)     - Ask with prompt directly
  q_livebook(prompt, id) - Ask in specific thread
  q_livebook_json(prompt) - Ask with JSON output
  q_livebook_auto(prompt) - Ask with auto-execution
  q_livebook_private(prompt) - Ask in private thread
  q_livebook_team(prompt) - Ask in team thread

Thread management:
  q_new()               - Create new thread
  q_continue(id)        - Continue specific thread
  q_fork(id)            - Fork existing thread
  q_list()              - List all threads
  q_share(id, vis)      - Share thread (public/private/team)
  q_compact(id)         - Compact thread
  q_status()            - Show active thread

Tools & Utilities:
  q_tools()             - Show available tools

Quick variants:
  q_json()              - Ask with JSON output
  q_auto()              - Ask with auto-execution
  q_private()           - Ask in private thread
  q_team()              - Ask in team thread

Management functions return {:ok, result} | {:error, reason}.
Main q() function returns :ok for clean output.

iex(1)>
```

### Demo: IEx Usage

:::note
Type `q()` and press Enter. You can then type a multi-line message, using Enter for new lines. Press Enter twice to submit to the LLM.

Amp can read, create, update, delete files and answer questions about your current directory.
:::

![IEx Demo](/images/iex-demo.gif)

## Livebook Integration

1. Start named IEx node:
```bash
iex --name test@127.0.0.1 --cookie mycookie -S mix
```

2. Start Livebook:
```bash
livebook server --port 8080
```

3. Connect Livebook to IEx:
   - Runtime Settings → Attached node
   - Name: `test@127.0.0.1`
   - Cookie: `mycookie`

4. Import in first cell:
```elixir
import AmpIEx
```

:::note
In Livebook, use `q_livebook("your prompt here")` for direct queries. Like IEx, Amp can read, create, update, delete files and answer questions about your current directory.
:::

![Livebook Demo](/images/livebook-demo.gif)

## Usage Examples

```elixir
# Generate documentation
q_livebook("Create a README.md for this project")

# Generate code
q_livebook("Create a GenServer for handling user sessions")

# Generate tests
q_livebook("Generate tests for my UserController module")

# Code improvements
q_livebook("Document this function with proper @doc annotations")
q_livebook("Improve this function's performance and readability")
```

## Livebook-Specific Commands

The AmpIEx module provides several Livebook-optimized functions:

| Command | Purpose | Example |
|---------|---------|---------|
| `q_livebook(prompt)` | Basic query with direct prompt | `q_livebook("Explain this code")` |
| `q_livebook_json(prompt)` | Returns structured JSON output | `q_livebook_json("List project dependencies")` |
| `q_livebook_auto(prompt)` | Auto-executes suggested commands | `q_livebook_auto("Install missing dependencies")` |
| `q_livebook_private(prompt)` | Creates private thread | `q_livebook_private("Review sensitive config")` |
| `q_livebook_team(prompt)` | Creates team-visible thread | `q_livebook_team("Share debugging approach")` |

:::tip
All `q_livebook_*` functions take an optional second parameter for thread ID: `q_livebook_json("analyze", "T-abc123")`
:::

## Daily Workflow

**IEx**: Start project with `iex -S mix`, use `q()` for AI assistance.

**Livebook**: Start named node, connect Livebook, import `AmpIEx`, use `q_livebook()` for non-interactive queries.

The integration feels seamless. AI assistance is always one function call away. 