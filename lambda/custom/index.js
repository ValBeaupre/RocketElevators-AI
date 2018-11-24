/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require("ask-sdk-core");

const GetGreetingsHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },

  handle(handlerInput) {
    let outputSpeech = "Greetings!";

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt(outputSpeech)
      .getResponse();
  }
};

const GetRemoteDataHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name ===
        "GetRocketElevatorsStatusIntent"
    );
  },
  async handle(handlerInput) {
    let outputSpeech = "";

    const totalElevatorsAPI = await getRemoteData(
      "https://rocketfoundationrestapi.azurewebsites.net/api/elevators/all"
    );
    const totalElev = Object.keys(JSON.parse(totalElevatorsAPI)).length;
    outputSpeech += `There are currently ${totalElev} elevators deployed in the `;

    const totalBuildingsAPI = await getRemoteData(
      "https://rocketfoundationrestapi.azurewebsites.net/api/buildings/all"
    );
    const totalBuild = Object.keys(JSON.parse(totalBuildingsAPI)).length;
    outputSpeech += `${totalBuild} buildings of your `;

    const totalCustomersAPI = await getRemoteData(
      "https://rocketfoundationrestapi.azurewebsites.net/api/customers/all"
    );
    const totalCust = Object.keys(JSON.parse(totalCustomersAPI)).length;
    outputSpeech += `${totalCust} customers. `;

    const elevatorsStatus = await getRemoteData(
      "https://rocketfoundationrestapi.azurewebsites.net/api/elevators/list"
    );
    const elevNotRunning = Object.keys(JSON.parse(elevatorsStatus)).length;
    outputSpeech += ` Currently, ${elevNotRunning} elevators are not in Running Status and are being serviced. `;

    const totalBatteriesAPI = await getRemoteData(
      "https://rocketfoundationrestapi.azurewebsites.net/api/batteries/all"
    );
    const totalBatt = Object.keys(JSON.parse(totalBatteriesAPI)).length;
    outputSpeech += ` ${totalBatt} Battreries are deployed across `;

    const totalCitiesAPI = await getRemoteData(
      "https://rocketfoundationrestapi.azurewebsites.net/api/addresses/cities"
    );
    const totalCities = Object.keys(JSON.parse(totalCitiesAPI)).length;
    outputSpeech += `${totalCities} cities. `;

    const totalQuotesAPI = await getRemoteData(
      "https://rocketfoundationrestapi.azurewebsites.net/api/quotes/all"
    );
    const totalQuotes = Object.keys(JSON.parse(totalQuotesAPI)).length;
    outputSpeech += ` On another note, you currently have ${totalQuotes} quotes awaiting processing. `;

    const totalLeadsAPI = await getRemoteData(
      "https://rocketfoundationrestapi.azurewebsites.net/api/leads/all"
    );
    const totalLeads = Object.keys(JSON.parse(totalLeadsAPI)).length;
    outputSpeech += ` You also have ${totalLeads} leads in your contact requests. `;

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt(outputSpeech)
      .getResponse();
  }
};

const GetElevatorStatusHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name ===
        "GetElevatorStatusIntent"
    );
  },
  async handle(handlerInput) {
    let elevatorNumber =
      handlerInput.requestEnvelope.request.intent.slots.id.value;
    let outputSpeech = "";

    await getRemoteData(
      `https://rocketfoundationrestapi.azurewebsites.net/api/elevators/${elevatorNumber}`
    ).then(response => {
      if (response === null) {
        outputSpeech =
          "The chosen elevator number is invalid. Please choose another elevator number. ";
      } else {
        const data = JSON.parse(response);
        outputSpeech += ` The elevator number ${elevatorNumber} is currently ${
          data.status
        } . `;
      }
    });

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt(outputSpeech)
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speechText = "You can introduce yourself by telling me your name";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name ===
        "AMAZON.CancelIntent" ||
        handlerInput.requestEnvelope.request.intent.name ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const speechText = "Goodbye!";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${
        handlerInput.requestEnvelope.request.reason
      }`
    );

    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak("Sorry, I can't understand the command. Please say again.")
      .reprompt("Sorry, I can't understand the command. Please say again.")
      .getResponse();
  }
};

const getRemoteData = function(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? require("https") : require("http");
    const request = client.get(url, response => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error("Failed with status code: " + response.statusCode));
      }
      const body = [];
      response.on("data", chunk => body.push(chunk));
      response.on("end", () => resolve(body.join("")));
    });
    request.on("error", err => reject(err));
  });
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetGreetingsHandler,
    GetRemoteDataHandler,
    GetElevatorStatusHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
