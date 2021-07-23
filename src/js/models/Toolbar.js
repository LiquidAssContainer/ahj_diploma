export class Toolbar {
  constructor(organizer) {
    this.organizer = organizer;
    this.search = document.getElementById('search');
    this.eraseSearch = document.getElementById('erase-search');
    this.toolbar = document.getElementById('toolbar');

    this.activeCategory = 'messages';
    this.registerEvents();
  }

  onSearch(value) {
    // const { value } = target;
    if (value) {
      this.organizer.performSearch(value);
      this.eraseSearch.classList.remove('hidden');
    } else {
      this.organizer.getRecentMessages(this.activeCategory);
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

      // if (this.activeCategory === category) {
      //   return;
      // }

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
