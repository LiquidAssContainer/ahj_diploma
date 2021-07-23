import { emojis } from '../../constants';
import { SelectPanel } from './SelectPanel';

export class EmojiPanel extends SelectPanel {
  constructor(messageForm) {
    super(messageForm, 'emoji');

    this.renderPanel();
  }

  renderPanel() {
    let HTML = '';
    for (const emoji of emojis) {
      HTML += `
      <li class="emoji_item">
        <img
          class="emoji_item_img"
          alt="${emoji.char}"
          src="https://ahj-diploma-chaos-organizer.herokuapp.com/emoji/${emoji.src}">
      </li>`;
    }
    this.list.innerHTML = HTML;
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
