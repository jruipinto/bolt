import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-assistencia-modal',
  templateUrl: './assistencia-modal.component.html',
  styleUrls: ['./assistencia-modal.component.scss']
})
export class AssistenciaModalComponent implements OnChanges {

  @Input() modalOpen = false;
  @Input() modalContext = {};
  @Output() modalOpenChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnChanges() {
    this.modalOpenChange.emit(this.modalOpen);
  }

}
