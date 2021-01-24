# 1

Import ChatWidgetModule into your AppModule (or other module)

# 2

Add <app-chat-widget> element to you .html

# 3

Inject CWStateService in to your component

```typescript
import { Component } from "@angular/core";
import { CwStateService } from "./services/cw-state.service";

@Component({
  selector: "app-something",
  templateUrl: "./something.component.html",
  styleUrls: ["./something.component.scss"]
})
export class SomethingComponent {
  constructor(private cws: CwStateService) {}
}
```

# 4 API

inteface CwState {
activeRoute: 'icon' | 'home' | 'chat';
activeChat: Message[] | null; /** Chat open \*/
chatsPreview: Message[] | null; /** List of all chats available for the chat-widget home page _/
selectedChatPreview: Message | null; /\*\* Chat opened by a click event. Listen to mutations on this prop and fill  
 _ activeChat
_/
newMessage: string | null; /\*\* Message created on cw-editor that is to be sent. Listen to mutations on
_ this prop and create new messages
\*/
}

cws.stateMutation\$: BehaviorSubject<Partial<CwState>>

stateMutation\$ observable publishes ONLY the
mutation to Chat-widget's state every time
it changes

cws.patchState(patch: Partial<CwState>): void
