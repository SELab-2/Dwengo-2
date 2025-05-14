import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Code } from '../../interfaces/codes/code';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { ClassCodePopupComponent } from '../class-code-popup/class-code-popup.component';
import { ClassCodeService } from '../../services/class-codes.service';

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

  private _codes: Code[] = [];
  private _classId?: string;

  // Class code popup
  readonly classCodePopup = inject(MatDialog);

  public constructor(
    private activeRoute: ActivatedRoute,
    private classCodeService: ClassCodeService
  ) {}

  public ngOnInit(): void {
    const id: string | null = this.activeRoute.snapshot.paramMap.get('id');

    console.log(id);

    if(id) this._classId = id;

    if(this._classId) {
      this.classCodeService.getClassCodes(this._classId)
        .subscribe((codes: Code[]) => {
          this._codes = codes;
        });
    }
    // TODO: else
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
    this.classCodeService.expireClassCode(code)
      .subscribe(response => {});
  }

  public deleteClassCode(code: Code): void {
    this.classCodeService.deleteClassCode(code)
      .subscribe(response => {});
  }

  public createClassCode(): void {
    if(this._classId) this.classCodeService.createClassCode(this._classId)
        .subscribe(response => {});
  }

  public activeOrExpired(code: Code): string {
    return code.expired ? 'Expired' : 'Active';
  }

  public get codes() {
    return this._codes;
  }

}
