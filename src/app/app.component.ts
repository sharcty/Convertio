import { Component } from '@angular/core';
import { ExchangeRateData } from 'src/app/interfaces/ExchangeRateData';
import { CurrencyService } from 'src/app/services/currency.service';
import { CurrencyCode, Theme } from './enums/enums';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'convertio';
  eur: number = 0;
  usd: number = 0;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.getCurrency();
  }

  getCurrency() {
    this.currencyService
      .getCurrency(CurrencyCode.EUR)
      .subscribe((result: ExchangeRateData) => {
        this.eur = result.conversion_rates
          ? result.conversion_rates[CurrencyCode.UAH]
          : 0;
      });
    this.currencyService
      .getCurrency(CurrencyCode.USD)
      .subscribe((result: ExchangeRateData) => {
        this.usd = result.conversion_rates
          ? result.conversion_rates[CurrencyCode.UAH]
          : 0;
      });
  }

  toggleMode() {
    let theme: string = 'theme';
    if (localStorage[theme] === Theme.LIGHT || !(theme in localStorage)) {
      document.documentElement.classList.add(Theme.DARK);
      localStorage[theme] = Theme.DARK;
    } else {
      document.documentElement.classList.remove(Theme.DARK);
      localStorage[theme] = Theme.LIGHT;
    }
  }
}
