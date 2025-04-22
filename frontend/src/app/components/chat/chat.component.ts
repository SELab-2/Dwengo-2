import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Message, NewMessage } from '../../interfaces/message/index';
import { MessageService } from '../../services/message.service';
// import { QuestionThreadService } from '../../services/questionThread.service';
import { AuthenticationService } from '../../services/authentication.service';
import { UserType } from '../../interfaces';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.less'],
    standalone: true,
    imports: [
        MatIcon,
        MatCard,
        CommonModule,
        FormsModule,
        MatToolbarModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
    ]
})
export class ChatComponent implements OnInit {
  @Input() questionThreadId!: string;

  messages: Message[] = [];
  newMessageContent = '';
  currentUserId: string = '';
  isInstructor: boolean = false;

  constructor(
    private messageService: MessageService,
    // private questionThreadService: QuestionThreadService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.retrieveUserId() || '';
    this.isInstructor = this.authService.retrieveUserType() === UserType.TEACHER;
    this.loadMessages();
  }

  loadMessages(): void {
    this.messageService.retrieveMessagesByQuestion(this.questionThreadId).subscribe(messages => {
      this.messages = messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });
  }

  sendMessage(): void {
    const trimmed = this.newMessageContent.trim();
    if (!trimmed) return;

    const newMsg: NewMessage = {
      creatorId: this.currentUserId,
      questionId: this.questionThreadId,
      content: trimmed,
      isInstructor: this.isInstructor,
    };

    this.messageService.createMessage(newMsg).subscribe(message => {
      this.messages.push(message);
      this.newMessageContent = '';
    });
  }
}