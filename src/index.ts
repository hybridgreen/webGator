
import { type CommandsRegistry, registerCommand, runCommand, userLoggedIn} from "./commands/commands";
import { resetHandler, aggHandler } from "./commands/utils";
import { loginHandler, listHandler, registerUserHandler, browseHandler} from "./commands/users";
import { feedsHandler, addFeedHandler } from "./commands/feeds";
import { followHandler, followingHandler, unfollowHandler } from "./commands/feedfollow";

async function main() {
  //console.log("[main] starting. argv =", process.argv.slice(2));
  const registry: CommandsRegistry = {};

  registerCommand(registry, "reset", resetHandler);
  registerCommand(registry, "agg", aggHandler);

  registerCommand(registry, "login", loginHandler);
  registerCommand(registry, "register", registerUserHandler);
  registerCommand(registry, "users", listHandler);

  registerCommand(registry, "feeds", feedsHandler);
  registerCommand(registry, "addfeed", userLoggedIn(addFeedHandler));
  
  registerCommand(registry, "follow", userLoggedIn(followHandler));
  registerCommand(registry, "following", userLoggedIn(followingHandler));
  registerCommand(registry, "unfollow", userLoggedIn(unfollowHandler));

  registerCommand(registry, "browse", userLoggedIn(browseHandler));

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