import axios from 'axios';

// https://api.slack.com/apps - slack app settings
export const slackMessage = async (webHook:string, message: string) => {
  try {
    await axios.post(webHook, {text: message});
  } catch (e) {
    console.error('slackNotifier error', e);
  }
}