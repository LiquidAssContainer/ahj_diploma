import { emojis } from '../../../constants';
import { SelectPanel } from './SelectPanel';

export class EmojiPanel extends SelectPanel {
  constructor(messageForm) {
    super(messageForm, 'emoji');
    this.renderPanel();
  }

  renderPanel() {
    let html = '';
    for (const emoji of emojis) {
      html += `
      <li class="emoji_item">
        <img
          class="emoji_item_img"
          alt="${emoji.char}"
          src="http://localhost:7070/emoji/${emoji.src}">
      </li>`;
    }
    this.list.innerHTML = html;
  }

  registerEvents() {
    super.registerEvents();

    this.panel.addEventListener('click', ({ target }) => {
      if (target.classList.contains('emoji_item_img')) {
        const { alt } = target;
        this.messageForm.insertEmoji(alt);
      }
    });
  }
}
