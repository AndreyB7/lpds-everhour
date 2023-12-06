import axios from 'axios';
import slackConfig from '../tokens/slack';

export const slackMessage = async (message: string) => {
  try {
    await axios.post(slackConfig.hookUrl, {text: message});
  } catch (e) {
    console.error('slackNotifier error', e);
  }
}