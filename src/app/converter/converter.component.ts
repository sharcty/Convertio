import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CurrencyService } from '../services/currency.service';
import { SupportedCurrency } from '../interfaces/SupportedCurrencyData';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css']
})
export class ConverterComponent {
  currencyService: CurrencyService;
  currencyForm: FormGroup = new FormGroup({
    fromCurrency: new FormControl('EUR'),
    amountFrom: new FormControl(0, [Validators.required, Validators.min(0)]),
    toCurrency: new FormControl('USD'),
    amountTo: new FormControl(0, [Validators.required, Validators.min(0)]),
  });
  supportedCodes: any;
  isLoading: any = true;

  constructor(currencyService: CurrencyService, private cdr: ChangeDetectorRef){
    this.currencyService = currencyService;
  }

  ngOnInit(): void {
    this.currencyService.getCurrenciesList().subscribe(
      (response: SupportedCurrency) => {
        if (response.result === 'success') {
          this.supportedCodes = response.supported_codes;
        } else {
          console.error('Failed to fetch supported codes.');
        }
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching supported codes:', error);
      }
    );    
  }

  convertCurrency() {
   /*const { fromCurrency, toCurrency, amountFrom } = this.currencyForm.value;

    this.currencyService.convertCurrency(fromCurrency, toCurrency, amountFrom).subscribe(
      result => {
        const convertedValue = result.conversion_result || 0;

        if (amountFrom !== this.currencyForm.value.amountFrom) {
          this.currencyForm.get('amountFrom')?.patchValue(convertedValue, { onlySelf: true, emitEvent: false });
        } else {
          this.currencyForm.get('amountTo')?.patchValue(convertedValue, { onlySelf: true, emitEvent: false });
        }
      }
    );

    this.cdr.detectChanges();*/
  }

  setCurrencyType(event: any) {
    this.currencyForm.get(event.target.id)?.patchValue(event.target.value);
    this.convertCurrency();
  }

  swapCurrency() {
    const { fromCurrency, toCurrency } = this.currencyForm.value;
    this.currencyForm.patchValue({
      fromCurrency: toCurrency,
      toCurrency: fromCurrency
    });
    this.convertCurrency();
  }

  hasError(controlName: string, errorName: string): boolean | undefined {
    return this.currencyForm.get(controlName)?.hasError(errorName) && this.currencyForm.get(controlName)?.touched;
  }
}
