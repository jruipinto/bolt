import {
  Component,
  ChangeDetectionStrategy,
  Input,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Assistencia } from 'src/app/shared';
@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent implements AfterViewInit {
  @Input() assistencia: Assistencia = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
}
