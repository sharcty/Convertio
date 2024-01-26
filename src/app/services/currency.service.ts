import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ExchangeRateData } from 'src/app/interfaces/ExchangeRateData';
import { PairConversion } from 'src/app/interfaces/PairConversionData';
import { environment } from '../../environments/environment';
import { SupportedCurrency } from '../interfaces/SupportedCurrencyData';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private currencyUrl = environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor( private http: HttpClient ) { }

getCurrency(currency_code: string): Observable<ExchangeRateData> {
  return this.http.get<ExchangeRateData>(this.currencyUrl+'/latest/'+currency_code);
}

convertCurrency(base_currency_code: string, target_currency_code: string, amount: string): Observable<PairConversion> {
  return this.http.get<PairConversion>(this.currencyUrl+'pair/'+base_currency_code+'/'+target_currency_code+'/'+amount);
}

getCurrenciesList(): Observable<SupportedCurrency>{
  return this.http.get<SupportedCurrency>(this.currencyUrl+'/codes');
}
//CONVERT CURRENCY
//https://v6.exchangerate-api.com/v6/7b07ac6e0db0bd416d9a83d5/pair/EUR/GBP/AMOUNT
//https://v6.exchangerate-api.com/v6/7b07ac6e0db0bd416d9a83d5/latest/UAH
}
