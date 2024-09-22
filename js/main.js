import commands from "./commands.js";
import executors from "./executors.js";
import { error, render } from "./helpers.js";
import shortcuts from "./shortcuts.js";

const input = document.getElementById("input");
const output = document.getElementById("output");

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const userInput = input.value.trim().split(" ");
    const command = userInput[0].toLowerCase();
    const options = userInput.slice(1);
    
    try {
      const commandDetails = commands.find((c) =>
        c.name.map((n) => n.toLowerCase()).includes(command)
      );

      if (commandDetails) {
        // Render in purple if the command is found
        render(`<span class="purple">❯&nbsp;</span>${input.value}`);
        if (command === "help") {
          commandDetails.execute(commands);
        } else {
          commandDetails.execute(options);
        }
      } else {
        const shortcutDetails = shortcuts
          .flatMap((c) => Object.entries(c.items))
          .find(([i]) => i.toLowerCase().startsWith(command));
        if (shortcutDetails) {
          // Render in purple if the shortcut is found
          render(`<span class="purple">❯&nbsp;</span>${input.value}`);
          render(`Redirecting to ${shortcutDetails[0]}...`);
          window.location.href = shortcutDetails[1];
        } else {
          // Render in red if the command or shortcut is not found
          render(`<span class="red">❯&nbsp;</span>${input.value}`);
          error("yellow", command, "command not found");
        }
      }
    } catch (e) {
      error("red", "JS Error", e.message);
    }
    
    input.value = "";
  }
});


window.addEventListener("load", () => {
  executors.ls();
  executors.motd();
  let root = document.getElementsByTagName("html")[0];
  root.style.backgroundColor = "#1a1b26"; // Set solid color background
  root.style.backgroundImage = "none";    // Ensure no background image is applied
});

