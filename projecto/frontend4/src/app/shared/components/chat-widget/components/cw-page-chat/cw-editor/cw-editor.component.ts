import { Component, Input } from '@angular/core';
import { CwStateService } from '../../../services/cw-state.service';

@Component({
  selector: 'app-cw-editor',
  templateUrl: './cw-editor.component.html',
  styleUrls: ['./cw-editor.component.scss']
})
export class CwEditorComponent {
  @Input() editorText: string;

  constructor(private cws: CwStateService) { }

  send(newMessage: string) {
    this.cws.patchState({ newMessage });
    this.editorText = null;
  }

}
