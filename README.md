# Human-AI Interaction

## Overview

Official Human-AI Interaction repository. This contains all code for the game portion of the Human AI study (interacting with chatbots and playing the Prisoner's Dilemma game with them).

## Contributing to this Repository

Please avoid pusing to `main` unless it is an extremely minor change..

For each of your tasks, create a branch for it. When you are done, make a pull request to `main`. See all the current tasks on our [Github Project](https://github.com/orgs/Santa-Clara-Imaginarium-Lab/projects/1) task board.

## Folder Structure

- `backend/` - Contains backend server code
- `client/` - Contains frontend React app

## Prerequisites

- **Node.js**: Make sure you have Node.js installed. This project is tested with Node.js v20.10.0
- **For clean installation**: Delete all node_modules/ folders and package-lock.json from client, backend and root folders

## Installation

To set up the project, follow these steps:

### Step 1: Install Dependencies

Navigate to the root directory "human-ai" (or whatever your local repository name is) and run the following command to install all dependencies:

```bash
npm run install-all
```

### Step 2: Add Environment Variables

Add .env files and required environment variables in backend/ and client/ folder. Create a new .env file in each subdirectory, refer to .env-example files for the format and structure. 

(Do not delete .env-example for Git purposes)

### Step 3: Run Project

Run the following command in the root directory:

```bash
npm run start-all
```

Note: it is best to run the servers in a dedicated terminal, NOT in the VSCode terminal.