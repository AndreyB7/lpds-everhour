import axios from 'axios';
import slackConfig from '../tokens/slack';

// https://api.slack.com/apps - slack app settings
export const slackMessage = async (message: string) => {
  try {
    await axios.post(slackConfig.hookUrl, {text: message});
  } catch (e) {
    console.error('slackNotifier error', e);
  }
}