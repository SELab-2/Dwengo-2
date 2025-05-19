import { Component, OnInit } from '@angular/core';
import { MatOption, MatSelectModule, MatSelectTrigger } from '@angular/material/select';

@Component({
  selector: 'language-selector',
  imports: [MatSelectModule, MatOption, MatSelectTrigger],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.less'
})

export class LanguageSelectorComponent implements OnInit {
  currentLocale: string = "en-US";
  localeToFlag: Record<string, string> = {
    "en-US": "us",
    "nl-BE": "be",
    "fr-FR": "fr",
    "de-DE": "de",
  }
  currentFlag: string = "us";

  constructor() {}

  ngOnInit() {
    const locale: string = window.location.pathname.split("/")[1];
    if (Object.keys(this.localeToFlag).includes(locale)) {
      this.currentLocale = locale;
      this.currentFlag = this.localeToFlag[locale];
    }
  }

  switchLocale(locale: string): void {
    this.currentLocale = locale;
    this.currentFlag = this.localeToFlag[locale];

    const newPath = window.location.pathname.replace(/^\/[a-z]{2}-[A-Z]{2}/, `/${locale}`);
    window.location.href = newPath;

  }

  
}
