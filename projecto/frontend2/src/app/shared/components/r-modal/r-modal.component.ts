import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'r-modal',
  templateUrl: './r-modal.component.html',
  styleUrls: ['./r-modal.component.scss']
})
export class RModalComponent {

  @Output() modalCloseEvent = new EventEmitter<boolean>();

  constructor() { }

}
