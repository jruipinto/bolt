import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'r-data-row',
  templateUrl: './r-data-row.component.html',
  styleUrls: ['./r-data-row.component.scss'],
})
export class RDataRowComponent implements OnInit {
  @Input() ariaExpanded: boolean;

  constructor() {}

  ngOnInit() {}
}
