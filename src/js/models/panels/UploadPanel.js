import { SelectPanel } from './SelectPanel';

export class UploadPanel extends SelectPanel {
  constructor(messageForm) {
    super(messageForm, 'upload-files');
  }

  onFilesUpload(files) {
    const filesArr = [...files];
    this.messageForm.uploadFiles(filesArr);
  }

  registerEvents() {
    super.registerEvents();

    const fileInputs = document.getElementsByClassName('file-input');
    fileInputs.forEach((fileInput) => {
      fileInput.addEventListener('change', ({ target }) => {
        this.onFilesUpload(target.files);
        target.value = '';
      });
    });
  }
}
