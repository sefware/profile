import {Component, Inject} from '@angular/core';
import {Language} from 'angular-l10n';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {InputModel} from '../../model/input.model';
import {StorageService} from '../../service/storage.service';

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input_dialog.component.html',
  styleUrls: ['./input_dialog.component.scss'],
})

export class InputDialogComponent {
  @Language() lang: string;

  data: InputModel[];
  public mask = [/\d/, /\d/, /\d/, ' ', '-', ' ', /\d/, /\d/];
  lists: InputModel[] = [];

  constructor(public _storageService: StorageService,
              public dialogRef: MatDialogRef<InputDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public mdData: any) {
    this.data = this.mdData;

    this.data = this._storageService.getListData();

    this.data.forEach(s => {
      const _s = new InputModel({
        time: s.time,
        up: s.up + ' - ' + s.low,
        low: '',
      });
      this.addList(s.time, _s);
    });
    this.addEmptyList();
  }

  addEmptyList() {

    const listSize = this.lists.length;

    if (listSize < 20) {
      for (let i = listSize; i < 20; i++) {
        if (this.lists.length < 100) {
          this.addList(String(i + 1), null);
        }
      }
    } else {
      for (let i = listSize; i < (listSize + 5); i++) {
        if (this.lists.length < 100) {
          this.addList(String(i + 1), null);
        }
      }
    }
  }

  setValue(index: number, type: string, value: string) {
    switch (type) {
      case 'time': {
        this.lists[index].time = String(value);
        break;
      }
      case 'up': {
        this.lists[index].up = value;
        break;
      }
    }
  }

  clearList() {
    this.lists.forEach((data: InputModel) => {
      this._storageService.removeData(data.time);
    });
    this.lists = [];
    this.addEmptyList();
  }

  addList(time: string, input: InputModel) {

    let _up = '';
    let _low = '';
    let _time = String(time);

    if (String(time).length === 1) {
      _time = '0' + _time;
    }

    // _time = 'รอบที่ ' + _time;

    if (input) {
      _up = input.up;
      _low = input.low;
      _time = input.time;
    }

    this.lists.push({
      time: _time,
      up: _up,
      low: _low
    });
  }

  saveData() {

    this.lists.forEach(s => {

      let saveUp = s.up.substring(0, 3);
      let saveLow = s.up.substring(6, 8);

      saveUp.replace('_', '');
      saveLow.replace('_', '');

      if (saveUp !== '' && saveLow !== '') {

        if (saveUp.length < 3) {
          if (saveUp.length === 0) {
            saveUp = '000';
          }
          if (saveUp.length === 1) {
            saveUp = '00' + saveUp;
          }
          if (saveUp.length === 2) {
            saveUp = '0' + saveUp;
          }
        }

        if (saveLow.length < 2) {
          if (saveLow.length === 0) {
            saveLow = '00';
          }
          if (saveLow.length === 1) {
            saveLow = '0' + saveLow;
          }
        }

        this._storageService.saveData({
          time: s.time,
          up: saveUp,
          low: saveLow
        });
      }
    });

    this.disable();
  }

  disable() {
    this.dialogRef.close();
  }
}
