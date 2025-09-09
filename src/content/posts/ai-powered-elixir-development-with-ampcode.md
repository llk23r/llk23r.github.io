---
title: "AI-Powered Elixir Development with Ampcode"
description: "Learn how to integrate AI assistance directly into your Elixir workflow using Ampcode in both IEx console and Livebook environments"
published: 2025-09-08
tags: ["elixir", "ai", "ampcode", "livebook", "iex", "development-tools"]
---

# AI-Powered Elixir Development with Ampcode

Modern development workflows are increasingly enhanced by AI assistance, and Elixir developers now have a powerful tool at their disposal: **Ampcode**. This guide will walk you through setting up AI-powered development assistance directly in your Elixir Interactive Shell (IEx) and Livebook environments.

## What is Ampcode?

Ampcode brings AI capabilities directly into your Elixir development environment, allowing you to:

- Generate code snippets and documentation
- Get contextual help and explanations
- Automate repetitive development tasks
- Create files and project structure
- All without leaving your familiar Elixir tooling

## Setting up AI in IEx Console

The simplest way to get started with Ampcode in IEx is through the global configuration file.

### Configuration via ~/.iex.exs

Create or edit your global IEx configuration file:

```bash
# Edit your global IEx configuration
vim ~/.iex.exs
```

Add your Ampcode configuration to this file. The `~/.iex.exs` file is automatically loaded every time you start an IEx session, making your AI helpers available across all your Elixir projects.

```elixir
# ~/.iex.exs
# Your Ampcode configuration goes here
# This will be loaded automatically in every IEx session
```

Once configured, simply start IEx in any Elixir project:

```bash
iex -S mix
```

Your AI helpers will be immediately available in the console.

*[Screenshot placeholder: IEx console with Ampcode loaded and ready]*

## Setting up AI in Livebook

For Livebook integration, we need a slightly different approach that allows the notebook to connect to a running IEx node.

### Step 1: Start IEx as a Named Node

Start your IEx session with specific node configuration:

```bash
iex --name test@127.0.0.1 --cookie mycookie -S mix
```

This command creates a named Elixir node that Livebook can connect to:
- `--name test@127.0.0.1`: Sets the node name
- `--cookie mycookie`: Sets the authentication cookie
- `-S mix`: Starts with your Mix project loaded

### Step 2: Configure Livebook Runtime

In your Livebook interface:

1. **Navigate to Runtime Settings**
   - Click on the "Runtime settings" button in your notebook
   - Select "Attached node" from the runtime options

*[Screenshot placeholder: Livebook runtime settings dialog]*

2. **Enter Connection Details**
   - **Name**: `test@127.0.0.1`
   - **Cookie**: `mycookie`
   
   These values should match exactly what you used in the IEx command.

*[Screenshot placeholder: Attached node configuration form]*

3. **Connect to the Node**
   - Click "Connect" to establish the connection
   - You should see a confirmation that the runtime is connected

### Step 3: Import Ampcode in Livebook

In your first Livebook cell, import the Ampcode functionality:

```elixir
import AmpIEx
```

This imports all the Ampcode methods, making them available throughout your notebook.

## Using AI Queries

Once set up, you can interact with AI using various query functions. Here's a practical example:

### Creating Project Documentation

```elixir
q_livebook("Can you please create a README.md for this project? Include how to run it as Attached node")
```

This query will:
- Analyze your current project structure
- Generate comprehensive README.md content
- Include specific instructions for the attached node setup
- Create the file directly in your project directory

*[Screenshot placeholder: Livebook cell executing AI query with generated README]*

### Other Available Queries

Your `~/.iex.exs` script contains additional query functions for different use cases:

```elixir
# Example queries (refer to your ~/.iex.exs for complete list)
q_code("Create a GenServer for handling user sessions")
q_test("Generate tests for my UserController module") 
q_docs("Document this function with proper @doc annotations")
q_refactor("Improve this function's performance and readability")
```

## Workflow Integration

### Development Flow with IEx

1. **Start your project**: `iex -S mix`
2. **Load your modules**: Standard Elixir development
3. **Get AI assistance**: Use query functions when needed
4. **Iterate quickly**: AI helps with boilerplate and documentation

### Development Flow with Livebook

1. **Start named IEx**: `iex --name test@127.0.0.1 --cookie mycookie -S mix`
2. **Open Livebook**: Connect to your running node
3. **Import helpers**: `import AmpIEx`
4. **Interactive development**: Mix code execution with AI assistance
5. **Generate artifacts**: Create files, tests, and documentation on-demand

*[Screenshot placeholder: Split screen showing IEx terminal and Livebook side by side]*

## Best Practices

### Query Optimization

- **Be specific**: Detailed queries yield better results
- **Provide context**: Mention your current module or function context
- **Iterate**: Refine queries based on initial results

### Node Management

- **Consistent naming**: Use predictable node names for easy reconnection
- **Cookie security**: Use unique cookies for different projects
- **Resource monitoring**: Named nodes consume slightly more resources

### Project Organization

- **Centralized config**: Keep Ampcode settings in `~/.iex.exs`
- **Project-specific helpers**: Add custom query functions per project
- **Version control**: Consider `.iex.exs` files for project-specific setups

## Troubleshooting

### Common Issues

**Connection Failed in Livebook**
- Verify node name and cookie match exactly
- Check that IEx is still running with the correct parameters
- Ensure no firewall blocking local connections

**Import Errors**
- Confirm Ampcode is properly installed and configured
- Check `~/.iex.exs` syntax for errors
- Restart IEx if configuration was updated

**Query Timeouts**
- Large queries may take time to process
- Break complex requests into smaller, focused queries
- Check your AI service connection and limits

## Advanced Usage

### Custom Query Functions

Extend the default queries by adding custom functions to your `~/.iex.exs`:

```elixir
defmodule MyAIHelpers do
  def q_phoenix(prompt) do
    # Custom Phoenix-specific AI queries
  end
  
  def q_database(prompt) do
    # Database-specific AI assistance
  end
end
```

### Project-Specific Configuration

Create a `.iex.exs` file in your project root for project-specific AI helpers:

```elixir
# .iex.exs (project-specific)
alias MyApp.{User, Post, Comment}

defmodule ProjectAI do
  def q_model(prompt) do
    # Model-specific queries with project context
  end
end
```

## Conclusion

Ampcode transforms your Elixir development experience by bringing AI assistance directly into your familiar tools. Whether you prefer the simplicity of IEx or the visual interactivity of Livebook, you now have powerful AI capabilities at your fingertips.

The integration is seamless—no context switching, no external tools, just enhanced productivity within your existing workflow. Start with the basic setup, explore the available queries, and gradually incorporate AI assistance into your daily development routine.

Happy coding with your new AI-powered Elixir environment! 🚀

---

*For more query examples and advanced configurations, explore your `~/.iex.exs` script and experiment with different prompt styles to find what works best for your development workflow.*