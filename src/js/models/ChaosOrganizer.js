import { Toolbar } from './Toolbar';
import { MessageList } from './MessageList';
import { NewMessageForm } from './NewMessageForm';

export class ChaosOrganizer {
  init() {
    this.toolbar = new Toolbar(this);
    this.messages = new MessageList(this);
    this.form = new NewMessageForm(this);

    this.getRecentMessages('messages');
  }

  getRecentMessages(category) {
    this.messages.getRecentInstances(category);
  }

  renderMessage(message) {
    this.messages.renderNewMessage(message);
  }

  performSearch(value) {
    this.messages.performSearch(value);
  }

  async switchCategory(category) {
    this.getRecentMessages(category);

    const [newMessageSection] = document.getElementsByClassName(
      'new-message_section',
    );
    if (category !== 'messages') {
      newMessageSection.classList.add('hidden');
    } else {
      newMessageSection.classList.remove('hidden');
    }
  }

  // async getPinnedMessage() {
  //   const message = await api.getPinnedMessage();
  //   if (message) {
  //     this.messages.renderPinnedMessage(message);
  //   }
  // }
}
