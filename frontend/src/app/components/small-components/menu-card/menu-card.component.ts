import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatRippleModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-menu-card',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatCardModule, MatRippleModule],
    templateUrl: './menu-card.component.html',
    styleUrls: ['./menu-card.component.less']
})
export class MenuCardComponent {
    @Input() title!: string;
    @Input() count!: number;
    @Input() icon!: string;
    @Input() selected!: boolean;
    @Input() color!: string;
    @Output() cardClick = new EventEmitter<void>();

    getColorClass(): string {
        return this.color ? this.color : "blue";
    }

    onClick() {
        this.cardClick.emit();
    }
}
