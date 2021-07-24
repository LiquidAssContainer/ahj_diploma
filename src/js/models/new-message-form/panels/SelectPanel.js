export class SelectPanel {
  constructor(messageForm, type) {
    this.messageForm = messageForm;
    this.init(type);
  }

  init(type) {
    [this.button] = document.getElementsByClassName(`${type}_btn`);
    [this.panel] = document.getElementsByClassName(`${type}_list_container`);
    [this.list] = document.getElementsByClassName(`${type}_list`);
    this.registerEvents();
  }

  open() {
    const activePanel = document.querySelector('.panel:not(.hidden)');
    if (activePanel && activePanel !== this.panel) {
      activePanel.classList.add('hidden');
    }
    this.panel.classList.remove('hidden');
    clearTimeout(this.closeTimeout);
  }

  close() {
    this.panel.classList.add('hidden');
  }

  startClosingPanel() {
    this.closeTimeout = setTimeout(() => {
      // может, не лучший способ, но пусть будет так
      const hoveredElems = [...document.querySelectorAll(':hover')];
      if (hoveredElems.includes(this.panel)) {
        return;
      }
      this.close();
    }, 350);
  }

  registerEvents() {
    this.button.addEventListener('mouseenter', () => this.open());
    this.panel.addEventListener('mouseenter', () => this.open());
    this.button.addEventListener('mouseleave', () => this.startClosingPanel());
    this.panel.addEventListener('mouseleave', () => this.startClosingPanel());
  }
}
