import { Component, Input, OnChanges, OnInit } from '@angular/core';
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
import { UserService } from '../../services/user.service';
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
export class ChatComponent implements OnInit, OnChanges {
    @Input() questionThreadId!: string;

    messages: Message[] = [];
    newMessageContent = '';
    currentUserId: string = '';
    isInstructor: boolean = false;
    usernamesMap: { [id: string]: string } = {};

    constructor(
        private messageService: MessageService,
        private authService: AuthenticationService,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.currentUserId = this.authService.retrieveUserId() || '';
        this.isInstructor = this.authService.retrieveUserType() === UserType.TEACHER;
        this.loadMessages();
        this.scrollToBottom();
    }

    ngOnChanges(): void {
        this.loadMessages();
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        setTimeout(() => {
            const el = document.querySelector('.messages-container');
            if (el) el.scrollTop = el.scrollHeight;
        }, 0);
    }

    loadMessages(): void {
        this.messageService.retrieveMessagesByQuestion(this.questionThreadId).subscribe(messages => {
            this.messages = messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

            const uniqueUserIds = [...new Set(messages.map(m => m.creatorId))];
            uniqueUserIds.forEach(id => {
                if (this.usernamesMap[id]) return; // Skip if already fetched
                this.userService.userWithId(id).subscribe(user => {
                    this.usernamesMap[id] = user.firstName + ' ' + user.familyName;
                });
            });
        });
    }

    sendMessage(): void {
        const trimmed = this.newMessageContent.trim();
        if (!trimmed) return;

        const newMsg: NewMessage = {
            senderId: this.currentUserId,
            threadId: this.questionThreadId,
            createdAt: new Date(),
            content: trimmed,
        };

        this.messageService.createMessage(newMsg).subscribe(messageId => {
            this.messages.push(
                {
                    id: messageId,
                    creatorId: this.currentUserId,
                    questionId: this.questionThreadId,
                    createdAt: new Date(),
                    content: trimmed,
                    isInstructor: this.isInstructor,
                } as Message
            );
            this.newMessageContent = '';
        });
        this.scrollToBottom();
    }
}