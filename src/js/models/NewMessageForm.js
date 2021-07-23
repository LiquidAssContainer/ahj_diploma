import { apiService as api } from './Api';
import { EmojiPanel } from './panels/EmojiPanel';
import { StickerPanel } from './panels/StickerPanel';
import { UploadPanel } from './panels/UploadPanel';

export class NewMessageForm {
  constructor(organizer) {
    this.organizer = organizer;
    this.files = [];

    this.form = document.getElementById('form');
    this.textarea = document.getElementById('textarea');
    [this.submitBtn] = document.getElementsByClassName('send-message_btn');
    this.previewContainer = document.getElementById('preview-container');
    this.dndInput = document.getElementById('drag-n-drop');

    this.emojiPanel = new EmojiPanel(this);
    this.stickerPanel = new StickerPanel(this);
    this.uploadPanel = new UploadPanel(this);

    this.registerEvents();
  }

  async sendMessage(data) {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    if (this.files) {
      for (const file of this.files) {
        formData.append('files', file);
      }
    }

    let message;
    switch (data.type) {
      case 'sticker':
        message = await api.sendSticker(formData);
        this.organizer.renderMessage(message);
        break;
      case 'text':
      case 'files':
        message = await api.sendMessage(formData);
        this.organizer.renderMessage(message);
    }
  }

  clearForm() {
    this.textarea.value = '';
    this.previewContainer.innerHTML = '';
    this.files = [];
  }

  addPreviews(files) {
    files.forEach((file, index) => {
      const [type] = file.type.split('/');
      const previewElem = document.createElement('div');
      previewElem.className = `preview ${type}-preview`;
      // let innerHTML = '';

      const src = URL.createObjectURL(file);
      switch (type) {
        case 'image':
          previewElem.innerHTML = `<img src=${src}>`;
          break;
        case 'video':
          previewElem.innerHTML = `<video src=${src}>`;
          break;
        case 'audio':
          previewElem.textContent = file.name;
      }

      const removeButtonHTML = `
        <button
          class="file_remove-btn"
          data-index="${this.files.length + index}">
          ×
        </button>`;

      previewElem.insertAdjacentHTML('beforeend', removeButtonHTML);
      this.previewContainer.insertAdjacentElement('beforeend', previewElem);
    });
  }

  onSubmit() {
    if (this.textarea.value.trim() !== '') {
      this.sendMessage({
        type: 'text',
        content: this.textarea.value,
      });
    } else if (this.files.length > 0) {
      this.sendMessage({
        type: 'files',
      });
    }
    this.clearForm();
  }

  insertEmoji(emoji) {
    const { selectionStart, selectionEnd, value } = this.textarea;
    const isNotSelected = selectionStart === selectionEnd;

    const charArr = value.split('');
    const newCharArr = [
      ...charArr.slice(0, selectionStart),
      emoji,
      ...charArr.slice(isNotSelected ? selectionStart : selectionEnd),
    ];
    this.textarea.value = newCharArr.join('');

    this.textarea.selectionStart = selectionStart + 2;
    this.textarea.selectionEnd = selectionStart + 2;
    this.textarea.focus();
  }

  uploadFiles(files) {
    this.addPreviews(files);
    this.files = this.files.concat(files);
  }

  registerEvents() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
    });

    this.submitBtn.addEventListener('click', () => this.onSubmit());

    this.textarea.addEventListener('input', ({ target }) => {
      target.style.height = 'auto';
      target.style.height = `${target.scrollHeight}px`;
    });

    this.textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.onSubmit();
      }
    });

    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      clearTimeout(this.dndTimeout);
      this.dndInput.classList.remove('hidden');
      this.dndTimeout = setTimeout(
        () => this.dndInput.classList.add('hidden'),
        100,
      );
    });

    this.dndInput.addEventListener('drop', (e) => {
      e.preventDefault();
      const { files } = e.dataTransfer;
      this.uploadPanel.onFilesUpload(files);
      this.dndInput.classList.add('hidden');
    });

    this.previewContainer.addEventListener('click', ({ target }) => {
      if (target.classList.contains('file_remove-btn')) {
        const { index } = target.dataset;
        this.files.splice(index, 1);
        const previewElem = target.closest('.preview');
        previewElem.remove();
      }
    });
  }
}
