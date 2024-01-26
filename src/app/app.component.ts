import { Component } from '@angular/core';
import { ExchangeRateData } from 'src/app/interfaces/ExchangeRateData';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'convertio';
  eur: number = 0;
  usd: number = 0;
  currencyService: CurrencyService;

  constructor(currencyService: CurrencyService){
    this.currencyService = currencyService;
  }

  ngOnInit(): void {
    this.getCurrency();
  }

  getCurrency(){
    /*this.currencyService.getCurrency("EUR").subscribe((result: ExchangeRateData) => {
      this.eur = result.conversion_rates ? result.conversion_rates["UAH"] : 0;
    });
    this.currencyService.getCurrency("USD").subscribe((result: ExchangeRateData) => {
      this.usd = result.conversion_rates ? result.conversion_rates["UAH"] : 0;
    });*/
  }

  toggleMode() {
    console.log(localStorage)
    if(localStorage['theme'] === 'light' || (!('theme' in localStorage))){
      document.documentElement.classList.add('dark');
      localStorage['theme'] = 'dark'
    } else {
      document.documentElement.classList.remove('dark');
      localStorage['theme'] = 'light'
    }
  }
}
