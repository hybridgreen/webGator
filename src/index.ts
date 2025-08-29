import { setUser, readConfig, Config} from "./config";
import { type CommandsRegistry, loginHandler, registerCommand, runCommand, registerUserHandler} from "./commands";

async function main() {
  //console.log("[main] starting. argv =", process.argv.slice(2));
  const registry: CommandsRegistry = {};

  registerCommand(registry, "login", loginHandler);
  registerCommand(registry, "register", registerUserHandler);

  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log("[main] no args");
    process.exit(1);
  }

  const commandName = args[0];
  //console.log("[main] about to run:", commandName, "with", args.slice(1));

  try {
    await runCommand(registry, commandName, ...args.slice(1));
    //console.log("[main] runCommand returned");
  } catch (e) {
    console.error("[main] runCommand threw:", e);
    process.exit(1);
  }

  console.log("[main] exiting");
  process.exit(0);
}

main().catch(e => console.error("[top] unhandled:", e));