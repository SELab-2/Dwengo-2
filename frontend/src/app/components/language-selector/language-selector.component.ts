import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatFormField, MatOption, MatSelect, MatSelectModule, MatSelectTrigger } from '@angular/material/select';

@Component({
  selector: 'app-language-selector',
  imports: [MatSelectModule, MatOption, MatSelectTrigger],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.less'
})

export class LanguageSelectorComponent implements OnInit {
  currentLocale: string = "en-US";
  localeToFlag: Record<string, string> = {
    "en-US": "us",
    "nl-BE": "be"
  }
  currentFlag: string = "us";
  constructor(private router: Router) {}
  ngOnInit() {
    const locale: string = this.router.url.split("/")[0];
    if (Object.keys(this.localeToFlag).includes(locale)) {
      this.currentLocale = locale;
    }
  }

  switchLocale(locale: string): void {
    this.currentLocale = locale;
    this.currentFlag = this.localeToFlag[locale];

    const newPath = window.location.pathname.replace(/^\/[a-z]{2}-[A-Z]{2}/, `/${locale}`);
    console.log("navigate:", newPath)
    window.location.href = newPath;

  }

  
}
