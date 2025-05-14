import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Code } from '../../interfaces/codes/code';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { ClassCodePopupComponent } from '../class-code-popup/class-code-popup.component';

@Component({
  selector: 'app-manage-codes',
  imports: [
    // Angular material
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './manage-codes.component.html',
  styleUrl: './manage-codes.component.less'
})
export class ManageCodesComponent implements OnInit {

  private _codes: Code[] = [
    {
      classId: "123456",
      createdAt: new Date(),
      code: "ABC123",
      expired: false
    },
    {
      classId: "123456",
      createdAt: new Date(),
      code: "DEF456",
      expired: true
    },
  ];
  private _classId?: string;

  // Class code popup
  readonly classCodePopup = inject(MatDialog);

  public constructor(
    private activeRoute: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    const id: string | null = this.activeRoute.snapshot.paramMap.get('id');
    if(id) this._classId = id;
    
    // TODO: fetch class codes
  }

  /**
   * Displays a popup with the class code (uses ClassCodePopupComponent).
   */
  public showClassCode(code: Code): void {
    this.classCodePopup.open(ClassCodePopupComponent, {
      data: { classCode: code.code }
    });
  }

  public expireClassCode(code: Code): void {
    // TODO
  }

  public deleteClassCode(code: Code): void {
    // TODO
  }

  public createClassCode(): void {
    // TODO
  }

  public activeOrExpired(code: Code): string {
    return code.expired ? 'Expired' : 'Active';
  }

  public get codes() {
    return this._codes;
  }

}
