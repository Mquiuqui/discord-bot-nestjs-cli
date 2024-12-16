# Discord Bot With NestJS CLI

## Overview
The **Discord Bot With NestJS CLI** is a command-line tool designed to simplify the process of creating Discord bots using the NestJS framework. With a user-friendly interface and minimal configuration, this CLI streamlines the setup of a robust and scalable bot project.

## Features
- Automated project setup using NestJS CLI.
- Custom module and service for Discord.js integration.
- Supports popular package managers: npm, yarn, and pnpm.
- Includes environment variable setup for secure bot token management.
- Keeps terminal output clean and focused with spinner feedback.

## Prerequisites
Before using this CLI, ensure the following:
- [Node.js](https://nodejs.org) installed (version 16+ recommended).
- A valid Discord bot token. [Learn how to create a bot](https://discord.com/developers/applications).

## Installation
First, install the CLI globally using npm:

```bash
npm install -g discord-bot-nestjs-cli
```

## Usage

### Commands
- **`init`**: Create a new Discord bot project.
- **`version`**: Display the CLI version.
- **`help`**: Show available commands and their usage.

### Initialize a Project
Run the following command to create a new project:

```bash
discord-bot-cli init
```

The CLI will prompt you for:
- **Project Name**: Name of the folder where the project will be created.
- **Package Manager**: Choose between npm, yarn, or pnpm.

### Example Workflow
1. Run the `init` command:
   ```bash
   discord-bot-cli init
   ```
   
2. Follow the prompts to configure the project.

3. Navigate to the project folder:
   ```bash
   cd <project-name>
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```
   or
   ```bash
   yarn start:dev
   ```

## Project Structure
The CLI sets up a project with the following structure:

```
<project-name>/
├── src/
│   ├── app.module.ts
│   ├── discord/
│   │   ├── discord.module.ts
│   │   ├── discord.service.ts
├── package.json
├── .env
```

- **`src/discord`**: Contains the module and service for Discord bot functionality.
- **`.env`**: Holds the `DISCORD_ENV` variable for your bot token.

## Environment Variables
The `.env` file includes:
```env
DISCORD_ENV=your_discord_bot_token_here
```
Replace `your_discord_bot_token_here` with your actual Discord bot token.

## Contribution
Contributions are welcome! Feel free to fork the repository, make improvements, and submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Author
Created by **Mquiuqui** to simplify Discord bot development with NestJS.

