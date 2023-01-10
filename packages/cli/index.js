#!/usr/bin/env node

const inquirer = require("inquirer");

const prompt = inquirer.createPromptModule();

const PROMPTS = [
  {
    type: "input",
    name: "name",
    message: "Your package name",
  },
  {
    type: "input",
    name: "age",
    message: "Your age",
  },
  {
    name: 'vueVersion',
    message: 'Select Vue version',
    type: 'list',
    choices: [
      {
        name: 'Vue 2',
        value: 'vue2',
      },
      {
        name: 'Vue 3',
        value: 'vue3',
      },
    ],
  },
];

async function run() {
    const args = await prompt(PROMPTS)
    console.log("args:", args);
}

run()
