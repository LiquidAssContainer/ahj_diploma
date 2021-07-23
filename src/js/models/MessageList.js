import { apiService as api } from './Api';
import { MessageListRender } from './MessageListRender';

export class MessageList {
  constructor(organizer) {
    this.organizer = organizer;
    this.messageList = document.getElementById('messages');
    [this.container] = document.getElementsByClassName('messages_container');
    this.modal = document.getElementById('modal');
    this.render = new MessageListRender();

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
    this.scrollToBottom();
  }

  renderNewMessage(message) {
    const messageHTML = this.render.getMessageHTML(message);
    this.messageList.insertAdjacentHTML('beforeend', messageHTML);
    this.scrollToBottom();
  }

  renderMessages(messages) {
    this.messageList.innerHTML = this.render.getMessagesHTML(messages);
  }

  renderMedia(files, type) {
    const container = document.createElement('div');
    container.className = `${type}_container`;
    container.innerHTML = this.render.getMediaHTML(files, type);
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

  scrollToBottom() {
    setTimeout(() => {
      this.container.scrollTop = this.container.scrollHeight;
    }, 100);
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
      html = this.render.getMessagesHTML(instances);
      this.messageList.insertAdjacentHTML('afterbegin', html);
    } else {
      html = this.render.getMediaHTML(instances, this.activeCategory);
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
        target.classList.contains('close-modal_btn')
        || target === this.modal
      ) {
        this.modal.classList.add('hidden');
      }
    });

    document.addEventListener('click', ({ target }) => {
      const mediaImage = target.closest('.media_image');
      if (mediaImage) {
        const img = mediaImage.firstElementChild;
        const { src } = img;
        const { filename } = img.dataset;
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

      if (target.closest('.message_pinned')) {
        if (target.classList.contains('unpin-message_btn')) {
          await api.unpinMessage();
          target.closest('.message_pinned').remove();
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
