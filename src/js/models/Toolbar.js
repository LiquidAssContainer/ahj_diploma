export class Toolbar {
  constructor(organizer) {
    this.organizer = organizer;
    this.messages = organizer.messages;

    this.search = document.getElementById('search');
    this.eraseSearch = document.getElementById('erase-search');
    this.toolbar = document.getElementById('toolbar');
    this.activeCategory = 'messages';

    this.registerEvents();
  }

  onSearch(value) {
    if (value) {
      this.messages.performSearch(value);
      this.eraseSearch.classList.remove('hidden');
    } else {
      this.messages.getRecentInstances(this.activeCategory);
      this.eraseSearch.classList.add('hidden');
    }
  }

  onEraseSearch() {
    this.search.value = '';
    this.onSearch('');
  }

  onTabSwitch({ target }) {
    if (target.classList.contains('category_button')) {
      const { category } = target.dataset;
      this.search.value = '';

      const [prevActive] = this.toolbar.getElementsByClassName('active');
      prevActive.classList.remove('active');
      target.classList.add('active');

      this.activeCategory = category;
      this.organizer.switchCategory(category);
    }
  }

  registerEvents() {
    this.search.addEventListener('input', (e) => this.onSearch(e.target.value));
    this.eraseSearch.addEventListener('click', () => this.onEraseSearch());
    this.toolbar.addEventListener('click', (e) => this.onTabSwitch(e));
  }
}
