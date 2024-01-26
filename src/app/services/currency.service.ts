import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ExchangeRateData } from 'src/app/interfaces/ExchangeRateData';
import { PairConversion } from 'src/app/interfaces/PairConversionData';
import { environment } from '../../environments/environment';
import { SupportedCurrency } from '../interfaces/SupportedCurrencyData';
import { ErrorType } from '../enums/enums';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private currencyUrl = environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getCurrency(currency_code: string): Observable<ExchangeRateData> {
    return this.http
      .get<ExchangeRateData>(`${this.currencyUrl}/latest/${currency_code}`)
      .pipe(catchError(this.handleError));
  }

  convertCurrency(
    base_currency_code: string,
    target_currency_code: string,
    amount: string
  ): Observable<PairConversion> {
    return this.http
      .get<PairConversion>(
        `${this.currencyUrl}pair/${base_currency_code}/${target_currency_code}/${amount}`
      )
      .pipe(catchError(this.handleError));
  }

  getCurrenciesList(): Observable<SupportedCurrency> {
    return this.http
      .get<SupportedCurrency>(`${this.currencyUrl}/codes`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred';

    if (
      error.error &&
      error.error.result === 'error' &&
      error.error['error-type']
    ) {
      switch (error.error['error-type']) {
        case ErrorType.UnsupportedCode:
          errorMessage = 'Unsupported currency code';
          break;
        case ErrorType.MalformedRequest:
          errorMessage = 'Malformed request';
          break;
        case ErrorType.InvalidKey:
          errorMessage = 'Invalid API key';
          break;
        case ErrorType.InactiveAccount:
          errorMessage = 'Inactive account';
          break;
        case ErrorType.QuotaReached:
          errorMessage = 'Quota reached';
          break;
        default:
          errorMessage = 'Unknown error occurred';
          break;
      }
    }

    return throwError(() => errorMessage);
  }
}
