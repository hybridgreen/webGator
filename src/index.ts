import { setUser, readConfig, Config} from "./config";
import { type CommandsRegistry, registerCommand, runCommand, userLoggedIn} from "./commands";
import * as utils from "./utils";


async function main() {
  //console.log("[main] starting. argv =", process.argv.slice(2));
  const registry: CommandsRegistry = {};

  registerCommand(registry, "login", utils.loginHandler);
  registerCommand(registry, "register", utils.registerUserHandler);
  registerCommand(registry, "reset", utils.resetHandler);
  registerCommand(registry, "users", utils.listHandler);
  registerCommand(registry, "agg", utils.aggHandler);
  registerCommand(registry, "feeds", utils.feedsHandler);

  registerCommand(registry, "addfeed", userLoggedIn(utils.addFeedHandler));
  registerCommand(registry, "follow", userLoggedIn(utils.followHandler));
  registerCommand(registry, "following", userLoggedIn(utils.followingHandler));
  registerCommand(registry, "unfollow", userLoggedIn(utils.unfollowHandler));
  registerCommand(registry, "browse", userLoggedIn(utils.browseHandler));

  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log("[main] no args");
    process.exit(1);
  }

  const commandName = args[0].toLowerCase();
  //console.log("[main] about to run:", commandName, "with", args.slice(1));

  try {
    await runCommand(registry, commandName, ...args.slice(1));
  } catch (e) {
    console.error("[main] runCommand threw:", e);
    process.exit(1);
  }

  //console.log("[main] exiting");
  process.exit(0);
}

main().catch(e => console.error("[top] unhandled:", e));