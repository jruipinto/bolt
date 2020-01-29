import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatWidgetComponent } from './chat-widget.component';
import { CwFloatingIconComponent } from './components/cw-floating-icon/cw-floating-icon.component';
import { CwPageHomeComponent } from './components/cw-page-home/cw-page-home.component';
import { CwPageChatComponent } from './components/cw-page-chat/cw-page-chat.component';
import { CwChatPreviewComponent } from './components/cw-page-home/cw-chat-preview/cw-chat-preview.component';
import { CwHeaderComponent } from './components/cw-header/cw-header.component';
import { CwMessageComponent } from './components/cw-page-chat/cw-message/cw-message.component';
import { CwMessageStateIconComponent } from './components/cw-message-state-icon/cw-message-state-icon.component';
import { CwEditorComponent } from './components/cw-page-chat/cw-editor/cw-editor.component';

@NgModule({
  declarations: [
    ChatWidgetComponent,
    CwFloatingIconComponent,
    CwPageHomeComponent,
    CwPageChatComponent,
    CwChatPreviewComponent,
    CwHeaderComponent,
    CwMessageComponent,
    CwMessageStateIconComponent,
    CwEditorComponent
  ],
  imports: [CommonModule, FormsModule],
  exports: [ChatWidgetComponent]
})
export class ChatWidgetModule { }
