import { apiService as api } from '../Api';
import { MessageListMarkup as Markup } from './MessageListMarkup';

export class MessageList {
  constructor(organizer) {
    this.organizer = organizer;

    this.messageList = document.getElementById('messages');
    [this.container] = document.getElementsByClassName('messages_container');
    this.modal = document.getElementById('modal');

    this.registerEvents();
  }

  displayEmptyList(message) {
    this.messageList.innerHTML = message;
  }

  clearMessageList() {
    this.messageList.innerHTML = '';
  }

  async getRecentInstances(category) {
    this.activeCategory = category;
    const response = await api.getRecentInstances(category);
    const recentMessages = response.messages || response;
    if (recentMessages.length === 0) {
      this.displayEmptyList('Пусто. Пока что.');
      return;
    }

    this.clearMessageList();

    const media = ['images', 'video', 'audio'];
    if (media.includes(category)) {
      this.lastMessageId = response.lastMsgId;
      this.renderMedia(recentMessages, category);
    } else {
      this.lastMessageId = recentMessages[0].id;
      this.renderMessages(recentMessages);
    }
    this.scrollToBottom(350);
  }

  renderNewMessage(message) {
    const messageHTML = Markup.getMessageHTML(message);
    this.messageList.insertAdjacentHTML('beforeend', messageHTML);
    this.scrollToBottom(100);
  }

  renderMessages(messages) {
    this.messageList.innerHTML = Markup.getMessagesHTML(messages);
  }

  renderMedia(files, type) {
    const container = document.createElement('div');
    container.className = `${type}_container`;
    container.innerHTML = Markup.getMediaHTML(files, type);
    this.messageList.insertAdjacentElement('afterbegin', container);
  }

  async performSearch(value) {
    const messages = await api.search(value);
    if (messages.length > 0) {
      this.clearMessageList();
      this.renderMessages(messages);
      this.activeCategory = null;
    } else {
      this.displayEmptyList(`No results for «${value}» :(`);
    }
  }

  scrollToBottom(delay = 0) {
    // конечно же, при загрузке множества изображений это не спасает
    setTimeout(() => {
      this.container.scrollTop = this.container.scrollHeight;
    }, delay);
  }

  async getInstancesBefore(lastId, type = 'messages') {
    const messages = await api.getMessagesFrom(lastId, type);
    return messages;
  }

  async removeMessage(id) {
    await api.removeMessage(id);
  }

  renderPreviousInstances(instances) {
    let html;
    if (['messages', 'favorites'].includes(this.activeCategory)) {
      html = Markup.getMessagesHTML(instances);
      this.messageList.insertAdjacentHTML('afterbegin', html);
    } else {
      html = Markup.getMediaHTML(instances, this.activeCategory);
      const mediaContainer = this.messageList.firstChild;
      mediaContainer.insertAdjacentHTML('afterbegin', html);
    }
  }

  async loadPreviousInstances() {
    if (!this.lastMessageId || !this.activeCategory) {
      return;
    }

    const response = await this.getInstancesBefore(
      this.lastMessageId,
      this.activeCategory,
    );

    const instances = response.messages || response;
    if (instances.length > 0) {
      this.lastMessageId = instances[0].id;
    } else {
      this.lastMessageId = null;
    }
    this.renderPreviousInstances(instances);
  }

  openImageModal({ src, filename }) {
    this.modal.classList.remove('hidden');
    this.modal.innerHTML = `
      <img class="modal_image" src=${src}>
      <a class="download_btn" download="${filename}" href="${src}"></a>
      <button class="close-modal_btn">×</button>`;
  }

  registerEvents() {
    this.modal.addEventListener('click', ({ target }) => {
      if (
        target.classList.contains('close-modal_btn') ||
        target === this.modal
      ) {
        this.modal.classList.add('hidden');
      }
    });

    document.addEventListener('click', ({ target }) => {
      if (target.classList.contains('download_btn')) {
        return;
      }

      const mediaImage = target.closest('.media_image');
      if (mediaImage) {
        const img = mediaImage.firstElementChild;
        const { src, dataset: filename } = img;
        this.openImageModal({ src, filename });
      }
    });

    this.container.addEventListener('click', async ({ target }) => {
      if (target.classList.contains('remove-message_btn')) {
        const messageItem = target.closest('.message_item');
        const { id } = messageItem.dataset;
        this.removeMessage(id);
        messageItem.remove();
      }

      const favoriteBtn = target.closest('.add-to-favorite_button');
      if (favoriteBtn) {
        const messageItem = favoriteBtn.closest('.message_item');
        const { id } = messageItem.dataset;
        if (favoriteBtn.classList.contains('favorite')) {
          await api.removeFromFavorites(id);
          favoriteBtn.classList.remove('favorite');
        } else {
          await api.addToFavorites(id);
          favoriteBtn.classList.add('favorite');
        }
      }
    });

    this.container.addEventListener('scroll', async () => {
      const initialHeight = this.messageList.offsetHeight;
      if (this.container.scrollTop === 0) {
        await this.loadPreviousInstances();
        const newHeight = this.messageList.offsetHeight;
        this.container.scrollTop = newHeight - initialHeight;
      }
    });
  }
}
