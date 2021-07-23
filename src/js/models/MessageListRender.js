import { handleLinksInString, handleEmojiInString, formatDate } from '../utils';

export class MessageListRender {
  getDownloadBtnHTML({ filename, src }) {
    // const src = file.src || file;
    return `<a class="download_btn" download="${filename}" href="https://ahj-diploma-chaos-organizer.herokuapp.com/${src}"></a>`;
  }

  getFileHTML(file, fileType) {
    const { filename, src } = file;
    let type = fileType;
    if (type === 'images') {
      type = 'image';
    }

    const wrapper = document.createElement('div');
    wrapper.className = `media_${type}`;
    // type = type === 'images' ? 'image' : type

    switch (type) {
      case 'image':
        wrapper.innerHTML = `
          <img class="image" src="https://ahj-diploma-chaos-organizer.herokuapp.com/${src}">`;
        break;

      case 'video':
        wrapper.innerHTML = `
          <div class="video_wrapper">
            <video class="video" controls>
              <source src="https://ahj-diploma-chaos-organizer.herokuapp.com/${src}">
            </video>
          </div>`;
        break;

      case 'audio':
        wrapper.innerHTML = `
          <div class="audio_title">${filename}</div>
          <audio class="audio" controls>
            <source src="https://ahj-diploma-chaos-organizer.herokuapp.com/${src}">
          </audio>`;
    }
    const downloadBtn = this.getDownloadBtnHTML(file, fileType);
    wrapper.insertAdjacentHTML('beforeend', downloadBtn);
    return wrapper.outerHTML;
  }

  getAttachmentsHTML(attachments) {
    if (!attachments) {
      return '';
    }

    let html = '';
    const attachmentTypes = ['images', 'video', 'audio'];
    for (const type of attachmentTypes) {
      if (!attachments[type]) {
        continue;
      }
      for (const attachment of attachments[type]) {
        html += this.getFileHTML(attachment, type, 'attachment');
      }
    }
    return html;
  }

  getStickerContentHTML(content) {
    // const { pack, id } = content;
    const { src } = content;
    return `
      <img class="message_sticker" src="https://ahj-diploma-chaos-organizer.herokuapp.com/${src}">
    `;
  }

  getTextContentHTML(content, attachments) {
    const attachmentsHTML = this.getAttachmentsHTML(attachments);

    let textContent = handleLinksInString(content);
    textContent = handleEmojiInString(textContent);

    return `
     <div class="message_text">
       ${textContent}
     </div>
     <div class="message_attachments">${attachmentsHTML}</div>`;
  }

  getMediaHTML(files, type) {
    let html = '';
    for (const file of files) {
      html += this.getFileHTML(file, type, 'media');
    }
    return html;
  }

  getMessagesHTML(messages) {
    let messagesHTML = '';
    for (const msg of messages) {
      messagesHTML += this.getMessageHTML(msg);
    }
    return messagesHTML;
  }

  getMessageHTML(message) {
    const {
      type, content, date, id, isFavorite, editDate, attachments,
    } = message;

    let contentHTML;
    switch (type) {
      case 'text':
        contentHTML = this.getTextContentHTML(content, attachments);
        break;
      case 'sticker':
        contentHTML = this.getStickerContentHTML(content);
        break;
      case 'files':
        contentHTML = `
          <div class="message_attachments">
            ${this.getAttachmentsHTML(attachments)}
          </div>`;
    }

    const editDateText = editDate ? ` (edit. ${formatDate(editDate)})` : '';
    const dateFullText = `${formatDate(date)}${editDateText}`;
    const addToFavoriteBtn = `<button class="message_btn add-to-favorite_button${
      isFavorite ? ' favorite' : ''
    }">
      <svg class="favorite_img" xmlns="http://www.w3.org/2000/svg" width="255" height="240" viewBox="0 0 51 48">
        <path d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
      </svg>
    </button>`;

    return `
      <li class="message_item" data-id="${id}">
        <div class="message_content">
          ${contentHTML}
        </div>
        <div class="message_date">${dateFullText}</div>
        <div class="message_btns">
          ${addToFavoriteBtn}
          <button class="message_btn remove-message_btn"></button>
        </div>
      </li>`;
  }
}