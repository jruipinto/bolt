import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../../models/message.model';

@Component({
  selector: 'app-cw-message',
  templateUrl: './cw-message.component.html',
  styleUrls: ['./cw-message.component.scss']
})
export class CwMessageComponent implements OnInit {
  @Input() message: Message;

  constructor() { }

  ngOnInit() {
  }

}
