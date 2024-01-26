import { ChangeDetectorRef } from '@angular/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ExchangeRateData } from 'src/interfaces/ExchangeRateData';
import { CurrencyService } from 'src/service/currency.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'convertio';
  currencyService: CurrencyService;
  eur: number = 0;
  usd: number = 0;
  currencyForm: FormGroup = new FormGroup({
    fromCurrency: new FormControl('EUR'),
    amountFrom: new FormControl(0, [Validators.required, Validators.min(0)]),
    toCurrency: new FormControl('USD'),
    amountTo: new FormControl(0, [Validators.required, Validators.min(0)]),
  });

  constructor(currencyService: CurrencyService, private formBuilder: FormBuilder, private cdr: ChangeDetectorRef){
    this.currencyService = currencyService;
  }

  ngOnInit(): void {
    this.getCurrency();
  }

  getCurrency(){
    this.currencyService.getCurrency("EUR").subscribe((result: ExchangeRateData) => {
      this.eur = result.conversion_rates ? result.conversion_rates["UAH"] : 0;
    });
    this.currencyService.getCurrency("USD").subscribe((result: ExchangeRateData) => {
      this.usd = result.conversion_rates ? result.conversion_rates["UAH"] : 0;
    });
  }

  convertCurrency(event: any){
    if(event.target.id === "amountTo"){
      this.currencyService.convertCurrency(this.currencyForm.value.toCurrency, this.currencyForm.value.fromCurrency, event.target.value).subscribe(
        result => {
          console.log(result)
          let bb = result.conversion_result? result.conversion_result : 0;
          this.currencyForm.get('amountFrom')?.patchValue(bb, {onlySelf: true, emitEvent: false});
          this.currencyForm.get('amountTo')?.patchValue(event.target.value);
          console.log(this.currencyForm.value);
        }
      );
    }else if(event.target.id === "amountFrom"){
      this.currencyService.convertCurrency(this.currencyForm.value.fromCurrency, this.currencyForm.value.toCurrency, event.target.value).subscribe(
        result => {
          console.log(result)
          let val = result.conversion_result? result.conversion_result : 0;
          this.currencyForm.get('amountFrom')?.patchValue(event.target.value);
          this.currencyForm.get('amountTo')?.patchValue(val, {onlySelf: true, emitEvent: false });
          console.log(this.currencyForm.value);
        }
      );
    }
    this.cdr.detectChanges();
  }

  setCurrencyType(event: any) {
    this.currencyForm.get(event.target.id)?.patchValue(event.target.value);
  }
}
