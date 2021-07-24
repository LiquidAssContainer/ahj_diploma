import { Toolbar } from './Toolbar';
import { MessageList } from './message-list/MessageList';
import { NewMessageForm } from './new-message-form/NewMessageForm';

export class ChaosOrganizer {
  init() {
    this.messages = new MessageList(this);
    this.toolbar = new Toolbar(this);
    this.form = new NewMessageForm(this);

    this.messages.getRecentInstances('messages');
  }

  async switchCategory(category) {
    this.messages.getRecentInstances(category);

    const [newMessageSection] = document.getElementsByClassName(
      'new-message_section',
    );
    if (category !== 'messages') {
      newMessageSection.classList.add('hidden');
    } else {
      newMessageSection.classList.remove('hidden');
    }
  }
}
