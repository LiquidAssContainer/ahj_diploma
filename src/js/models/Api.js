export class apiService {
  static baseUrl = 'https://ahj-diploma-chaos-organizer.herokuapp.com';

  static username = 'test';

  static async request(url, options) {
    const response = await fetch(`${this.baseUrl}${url}`, options);
    if (response.ok) {
      try {
        return await response.json();
      } catch {
        return null;
      }
    } else {
      console.log(`Ошибка HTTP: ${response.status}`);
      throw new Error(response.status);
    }
  }

  static search(value) {
    const query = encodeURIComponent(value);
    return this.request(`/${this.username}/messages/search?q=${query}`);
  }

  static getRecentInstances(type) {
    return this.request(`/${this.username}/${type}`);
  }

  static getRecentFavorites() {
    return this.request(`/${this.username}/favorites`);
  }

  static getMessagesFrom(msgId, category) {
    return this.request(`/${this.username}/${category}?before=${msgId}`);
  }

  static removeMessage(msgId) {
    return this.request(`/${this.username}/messages/${msgId}`, {
      method: 'DELETE',
    });
  }

  static addToFavorites(msgId) {
    return this.request(`/${this.username}/favorites/${msgId}`, {
      method: 'POST',
    });
  }

  static removeFromFavorites(msgId) {
    return this.request(`/${this.username}/favorites/${msgId}`, {
      method: 'DELETE',
    });
  }

  static sendMessage(formData) {
    return this.request(`/${this.username}/messages`, {
      method: 'POST',
      body: formData,
    });
  }

  static sendFiles(formData) {
    return this.request(`/${this.username}/files`, {
      method: 'POST',
      body: formData,
    });
  }

  static sendSticker(formData) {
    return this.request(`/${this.username}/messages`, {
      method: 'POST',
      body: formData,
    });
  }

  static getStickers() {
    return this.request('/stickers');
  }

  // static getPinnedMessage() {
  //   return this.request(`/test/pinned`);
  // }

  // static unpinMessage() {
  //   return this.request(`/test/pinned`, { method: 'DELETE' });
  // }

  // static pinMessage() {
  //   return this.request(`/test/pinned`, { method: 'DELETE' });
  // }
}
