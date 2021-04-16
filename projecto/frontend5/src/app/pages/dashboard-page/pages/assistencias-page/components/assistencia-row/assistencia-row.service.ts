import { ElementRef, Injectable } from '@angular/core';

interface AssistenciaRowViewDeps {
  collapsedViewEl: ElementRef;
  expandedViewEl: ElementRef;
  buttonsContainerEl: ElementRef;
}

@Injectable({
  providedIn: 'root',
})
export class AssistenciaRowService {
  isComponentExpanded = false;

  constructor() {}

  toogleView(deps: AssistenciaRowViewDeps): void {
    const LARGE_SCREEN_WIDTH = 992;
    const screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    if (screenWidth < LARGE_SCREEN_WIDTH) {
      return;
    }

    if (this.isComponentExpanded) {
      this.collapseView(deps);
    } else {
      this.expandView(deps);
    }
  }

  private collapseView(deps: AssistenciaRowViewDeps): void {
    deps.expandedViewEl.nativeElement.style.maxHeight = '0';
    deps.expandedViewEl.nativeElement.style.opacity = '0';
    deps.expandedViewEl.nativeElement.style.transition =
      'max-height 0.2s ease-out, opacity 0.3s ease-out';
    deps.collapsedViewEl.nativeElement.style.opacity = '1';
    deps.collapsedViewEl.nativeElement.style.transition =
      'opacity 0.4s ease-in';
    setTimeout(() => {
      deps.buttonsContainerEl.nativeElement.style.display = 'none';
    }, 100);
    this.isComponentExpanded = false;
  }

  private expandView(deps: AssistenciaRowViewDeps): void {
    deps.expandedViewEl.nativeElement.style.cursor = 'initial';
    deps.expandedViewEl.nativeElement.style.maxHeight = '1000px';
    deps.expandedViewEl.nativeElement.style.opacity = '1';
    deps.expandedViewEl.nativeElement.style.transition =
      'max-height 0.25s ease-in, opacity 0.25s ease';
    deps.collapsedViewEl.nativeElement.style.opacity = '0';
    deps.collapsedViewEl.nativeElement.style.transition = 'opacity 0.1s linear';
    setTimeout(() => {
      deps.buttonsContainerEl.nativeElement.style.display = 'block';
    }, 100);
    this.isComponentExpanded = true;
  }
}
