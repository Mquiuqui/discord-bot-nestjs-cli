#!/usr/bin/env node

import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import gradient, { pastel } from 'gradient-string';
import inquirer from 'inquirer';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createSpinner } from 'nanospinner';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Display a styled title
const showTitle = () => {
  console.log(pastel(figlet.textSync('Discord Bot With NestJS CLI!', { horizontalLayout: 'full' })));
};

// Display a welcome message animation
const showWelcomeMessage = () => {
  const animation = chalkAnimation.rainbow('Welcome to Discord Bot With NestJS CLI! Let’s start 🚀\n');
  return new Promise(resolve => {
    setTimeout(() => {
      animation.stop();
      resolve();
    }, 3000);
  });
};

// Ask user for project details
const askProjectDetails = async () => {
  console.log(chalk.blue('Asking for project details...'));
  const questions = [
    {
      type: 'input',
      name: 'projectName',
      message: 'What is the name of your project?',
      validate: input => input ? true : 'The project name cannot be empty.'
    },
    {
      type: 'list',
      name: 'packageManager',
      message: 'Which package manager do you want to use?',
      choices: ['npm', 'yarn', 'pnpm'],
    }
  ];

  const answers = await inquirer.prompt(questions);
  console.log(chalk.green(`Project name: ${answers.projectName}, Package manager: ${answers.packageManager}`));
  return answers;
};

// Run command with spinner support
const runCommand = (command, args, cwd = process.cwd(), spinner) => {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, { cwd, shell: true, stdio: ['ignore', 'ignore', 'ignore'] });
  
      // Keep spinner running during execution
      const interval = setInterval(() => {
        spinner.update({ text: `${command} ${args.join(' ')} is still running...` });
      }, 500);
  
      process.on('close', (code) => {
        clearInterval(interval);
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}`));
        }
      });
  
      process.on('error', (error) => {
        clearInterval(interval);
        reject(error);
      });
    });
  };

// Create the NestJS project
const createNestProject = async ({ projectName, packageManager }) => {
  const spinner = createSpinner('Starting project creation...').start();

  try {
    const startTime = Date.now();

    spinner.update({ text: 'Running NestJS CLI to create the project...' });
    await runCommand('npx', ['@nestjs/cli', 'new', projectName, '-p', packageManager], process.cwd(), spinner);
    

    spinner.update({ text: 'Updating package.json description...' });
    const packageJsonPath = path.join(projectName, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    packageJson.description = 'Created with Discord Bot With NestJS CLI by Mquiuqui';
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

    spinner.update({ text: 'Adding Discord module and service...' });
    const discordBotModule = `import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';

@Module({
  providers: [DiscordService],
})
export class DiscordModule {}`;

    const discordService = `import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, GatewayIntentBits } from 'discord.js';

@Injectable()
export class DiscordService implements OnModuleInit {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
      ],
    });
  }

  async onModuleInit() {
    console.log('Starting Discord bot...');
    await this.client.login(process.env.DISCORD_ENV);

    this.client.on('ready', () => {
      console.log('Discord bot is online!');
    });

    this.client.on('messageCreate', async (message) => {
      if (!message.content.startsWith('!') || message.author.bot) return;

      const args = message.content.slice(1).trim().split(/ +/);
      const command = args.shift()?.toLowerCase();

      if (command === 'test') {
        await message.reply('Test command executed!');
      }
    });
  }
}`;

    const envFileContent = `DISCORD_ENV=your_discord_bot_token_here\n`;
    const discordDirPath = path.join(projectName, 'src/discord');
    const modulePath = path.join(discordDirPath, 'discord.module.ts');
    const servicePath = path.join(discordDirPath, 'discord.service.ts');
    const envPath = path.join(projectName, '.env');

    spinner.update({ text: 'Creating necessary files and directories...' });
    await fs.mkdir(discordDirPath, { recursive: true });
    await fs.writeFile(modulePath, discordBotModule);
    await fs.writeFile(servicePath, discordService);
    await fs.writeFile(envPath, envFileContent);


    spinner.update({ text: 'Installing discord.js package...' });
    await runCommand(packageManager, ['add', 'discord.js'], path.join(process.cwd(), projectName), spinner);

    spinner.success({ text: `Project ${projectName} successfully created in ${((Date.now() - startTime) / 1000).toFixed(2)}s!` });
  } catch (error) {
    spinner.error({ text: 'Failed to create the NestJS project.' });
    console.error(chalk.red(error));
    process.exit(1);
  }
};

// Commands
const showVersion = async () => {
  const packageJson = await import('./package.json', { assert: { type: 'json' } });
  console.log(chalk.green(`Discord Bot With NestJS CLI version: ${packageJson.default.version}`));
};

const showHelp = () => {
  console.log(`
${chalk.blue('Available commands:')}`);
  console.log(`${chalk.cyan('init')}     - Create a new Discord Bot project`);
  console.log(`${chalk.cyan('version')}  - Display the CLI version`);
  console.log(`${chalk.cyan('help')}     - Show this help message`);
};

const main = async () => {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('help')) {
    showHelp();
    return;
  }

  if (args.includes('version')) {
    return showVersion();
  }

  if (args.includes('init')) {
    console.clear();
    console.log(chalk.blue('Launching Discord Bot With NestJS CLI...'));
    showTitle();
    await showWelcomeMessage();

    console.log(chalk.blue('Gathering project details...'));
    const projectDetails = await askProjectDetails();

    console.log(chalk.blue('Starting project creation process...'));
    await createNestProject(projectDetails);

    console.log(pastel(`\n✨ Project ${projectDetails.projectName} is ready to use!`));
    console.log(chalk.blue('\nRun the following commands to get started:'));
    console.log(chalk.cyan(`  cd ${projectDetails.projectName}`));
    console.log(chalk.cyan(`  ${projectDetails.packageManager === 'npm' ? 'npm run' : projectDetails.packageManager} start:dev`));
    return;
  }

  console.log(chalk.red(`Unknown command: ${args[0]}`));
  showHelp();
};

main().catch(error => {
  console.error(chalk.red('Error running the CLI:'), error);
  process.exit(1);
});
