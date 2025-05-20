import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthenticatedHeaderComponent } from '../../components/authenticated-header/authenticated-header.component';
import { ChatViewComponent } from '../chat-view/chat-view.component';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AuthenticatedHeaderComponent,
    ChatViewComponent
  ],
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.less']
})
export class ChatPageComponent {
  constructor() {}
}