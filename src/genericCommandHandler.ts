import { Activity, TurnContext } from "botbuilder";
import {
  CommandMessage,
  TeamsFxBotCommandHandler,
  TriggerPatterns,
} from "@microsoft/teamsfx";

// send a Post request to https://nexus.lndnr.cc/ with a body like:
// {
//  "userProblem": "I need someone that can program in Java and JavaScript"
//}
// and returns
async function find_person(problem: string): Promise<string> {
  var payload = {
    userProblem: problem,
  };

  return await fetch("https://nexus.lndnr.cc/find", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then(function (res) {
    return res.text();
  });
}

/**
 * The `GenericCommandHandler` registers patterns with the `TeamsFxBotCommandHandler` and responds
 * with appropriate messages if the user types general command inputs, such as "hi", "hello", and "help".
 */
export class GenericCommandHandler implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = new RegExp(/^.+$/);

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    console.log(`App received message: ${message.text}`);

    let response = "";
    switch (message.text) {
      case "hi":
        response =
          "Hi there! I'm your Command Bot, here to assist you with your tasks. Type 'help' for a list of available commands.";
        break;
      case "hello":
        response =
          "Hello! I'm your Command Bot, always ready to help you out. If you need assistance, just type 'help' to see the available commands.";
        break;
      case "help":
        response =
          "Here's a list of commands I can help you with:\n" +
          "- 'hi' or 'hello': Say hi or hello to me, and I'll greet you back.\n" +
          "- 'help': Get a list of available commands.\n" +
          "- 'helloworld': See a sample response from me.\n" +
          "\nFeel free to ask for help anytime you need it!";
        break;
      default:
        if (message.text.startsWith("search:")) {
          response = (await find_person(message.text)).toString();
        } else {
          const removedMentionText = TurnContext.removeRecipientMention(
            context.activity
          );

          const txt = removedMentionText
            .toLowerCase()
            .replace(/\n|\r/g, "")
            .trim();

          const nexusResponse = await fetch("https://nexus.lndnr.cc/find", {
            method: "POST",
            body: JSON.stringify({ userProblem: txt }),
          });
          console.log(nexusResponse.status);
          const parsedResponse = await nexusResponse.json();

          response = parsedResponse.reason;
        }
    }

    return response;
  }
}
