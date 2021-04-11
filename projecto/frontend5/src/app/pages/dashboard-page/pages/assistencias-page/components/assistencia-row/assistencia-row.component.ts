import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { Assistencia } from 'src/app/shared';

@Component({
  selector: 'app-assistencia-row',
  templateUrl: './assistencia-row.component.html',
  styleUrls: ['./assistencia-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistenciaRowComponent implements OnInit {
  @Input() assistencia: Assistencia;
  @Output() runAssistencia = new EventEmitter<number>();
  @Output() openAssistencia = new EventEmitter<number>();
  @Output() assignAssistencia = new EventEmitter<number>();
  @ViewChild('collapsedView') collapsedViewEl: ElementRef;
  @ViewChild('expandedView') expandedViewEl: ElementRef;
  @ViewChild('buttonsContainer') buttonsContainerEl: ElementRef;

  isExpanded = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  expandView(expand: boolean) {
    const w =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    if (w < 992) {
      return;
    }
    if (expand) {
      this.expandedViewEl.nativeElement.style.maxHeight = '1000px';
      this.expandedViewEl.nativeElement.style.opacity = '1';
      this.expandedViewEl.nativeElement.style.transition =
        'max-height 0.25s ease-in, opacity 0.25s ease';
      this.collapsedViewEl.nativeElement.style.opacity = '0';
      this.collapsedViewEl.nativeElement.style.transition =
        'opacity 0.1s linear';
      setTimeout(() => {
        this.buttonsContainerEl.nativeElement.style.display = 'block';
      }, 100);
      this.isExpanded = expand;
    } else {
      this.expandedViewEl.nativeElement.style.maxHeight = '0';
      this.expandedViewEl.nativeElement.style.opacity = '0';
      this.expandedViewEl.nativeElement.style.transition =
        'max-height 0.2s ease-out, opacity 0.3s ease-out';
      this.collapsedViewEl.nativeElement.style.opacity = '1';
      this.collapsedViewEl.nativeElement.style.transition =
        'opacity 0.4s ease-in';
      setTimeout(() => {
        this.buttonsContainerEl.nativeElement.style.display = 'none';
      }, 100);
      setTimeout(() => {
        this.isExpanded = expand;
        this.cdr.detectChanges();
      }, 300);
    }
  }
}
