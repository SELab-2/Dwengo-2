import { Component } from '@angular/core';
import { ChatComponent } from '../../components/chat/chat.component';
import { AuthenticatedHeaderComponent } from '../../components/authenticated-header/authenticated-header.component';

@Component({
    selector: 'app-chat-page',
    templateUrl: './chat-page.component.html',
    styleUrls: ['./chat-page.component.less'],
    standalone: true,
    imports: [ChatComponent, AuthenticatedHeaderComponent],
})
export class ChatPageComponent {
  mockThreadId = 'mock-thread-001'; // use something that triggers mock data
}
