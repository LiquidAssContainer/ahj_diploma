import { apiService as api } from '../../Api';
import { SelectPanel } from './SelectPanel';

export class StickerPanel extends SelectPanel {
  constructor(messageForm) {
    super(messageForm, 'stickerpack');
    this.initStickerPanel();
  }

  async initStickerPanel() {
    [this.stickerPackTabs] =
      document.getElementsByClassName('stickerpack_tabs');
    this.stickerPacks = await api.getStickers();
    this.renderPanel();
  }

  renderPanel(packName) {
    if (!packName) {
      [this.activePack] = this.stickerPacks;
    } else {
      this.activePack = this.stickerPacks.find(
        (elem) => elem.pack === packName,
      );
    }

    let stickerPackTabHTML = '';
    for (const pack of this.stickerPacks) {
      stickerPackTabHTML += `
      <button
        class="stickerpack_tab
          ${this.activePack.pack === pack.pack ? ' active' : ''}"
        data-pack="${pack.pack}">
        <img class="stickerpack_preview"
          src="http://localhost:7070/${pack.preview}">
      </button>`;
    }
    this.stickerPackTabs.innerHTML = stickerPackTabHTML;

    const stickerPack = document.createElement('ul');
    stickerPack.className = 'sticker_list';
    stickerPack.dataset.pack = this.activePack.pack;

    for (const sticker of this.activePack.stickers) {
      const elemHtml = `
        <img
          class="sticker_item"
          src="http://localhost:7070/${sticker.src}"
          data-id="${sticker.id}"
          data-src=${sticker.src}>`;
      stickerPack.innerHTML += elemHtml;
    }
    this.list.innerHTML = '';
    this.list.appendChild(stickerPack);
  }

  registerEvents() {
    super.registerEvents();

    this.panel.addEventListener('click', ({ target }) => {
      if (target.classList.contains('sticker_item')) {
        const { id, src } = target.dataset;
        this.messageForm.sendMessage({
          type: 'sticker',
          content: JSON.stringify({ pack: this.activePack.pack, id, src }),
        });
      }

      const stickerpackTab = target.closest('.stickerpack_tab');
      if (stickerpackTab) {
        const { pack } = stickerpackTab.dataset;
        this.renderPanel(pack);
      }
    });
  }
}
