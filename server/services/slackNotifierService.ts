import axios from 'axios';

// https://api.slack.com/apps - slack app settings
export const slackMessage = async (webHook:string, message: string) => {
  try {
    await axios.post(webHook, {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": message
          }
        }
      ]
    });
  } catch (e) {
    console.error('slackNotifier error', e);
  }
}