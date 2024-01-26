import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CurrencyService } from '../services/currency.service';
import { SupportedCurrency } from '../interfaces/SupportedCurrencyData';
import { finalize } from 'rxjs/operators';
import { CurrencyCode, FormControlIds } from '../enums/enums';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css'],
})
export class ConverterComponent implements OnInit {
  currencyForm: FormGroup;
  supportedCodes: any;
  isLoading: boolean = true;

  constructor(
    private currencyService: CurrencyService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.currencyForm = this.fb.group({
      fromCurrency: [CurrencyCode.EUR],
      amountFrom: [0, [Validators.required, Validators.min(0)]],
      toCurrency: [CurrencyCode.USD],
      amountTo: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.getCurrenciesList();
  }

  getCurrenciesList() {
    this.currencyService
      .getCurrenciesList()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((response: SupportedCurrency) => {
        this.supportedCodes = response.supported_codes;
      });
  }

  convertCurrency(event: any) {
    if (!this.currencyForm.valid) {
      return;
    }

    const { fromCurrency, toCurrency, amountFrom, amountTo } =
      this.currencyForm.value;

    const sourceCurrency =
      event?.target.id === FormControlIds.AMOUNT_TO ? toCurrency : fromCurrency;
    const targetCurrency =
      event?.target.id === FormControlIds.AMOUNT_TO ? fromCurrency : toCurrency;
    const sourceAmount =
      event?.target.id === FormControlIds.AMOUNT_TO ? amountTo : amountFrom;

    this.currencyService
      .convertCurrency(sourceCurrency, targetCurrency, sourceAmount)
      .subscribe((result) => {
        const convertedValue = result.conversion_result || 0;

        if (event?.target.id === FormControlIds.AMOUNT_TO) {
          this.currencyForm
            .get(FormControlIds.AMOUNT_FROM)
            ?.patchValue(convertedValue, { onlySelf: true, emitEvent: false });
          this.currencyForm
            .get(FormControlIds.AMOUNT_TO)
            ?.patchValue(event.target.value);
        } else if (event?.target.id === FormControlIds.AMOUNT_FROM) {
          this.currencyForm
            .get(FormControlIds.AMOUNT_FROM)
            ?.patchValue(event.target.value);
          this.currencyForm
            .get(FormControlIds.AMOUNT_TO)
            ?.patchValue(convertedValue, { onlySelf: true, emitEvent: false });
        } else {
          this.currencyForm
            .get(FormControlIds.AMOUNT_TO)
            ?.patchValue(convertedValue, { onlySelf: true, emitEvent: false });
        }
      });

    this.cdr.detectChanges();
  }

  setCurrencyType(event: any) {
    this.currencyForm.get(event.target.id)?.patchValue(event.target.value);
    this.convertCurrency(event);
  }

  swapCurrency() {
    const { fromCurrency, toCurrency } = this.currencyForm.value;
    this.currencyForm.patchValue({
      fromCurrency: toCurrency,
      toCurrency: fromCurrency,
    });
    this.convertCurrency(null);
  }

  hasError(controlName: string, errorName: string): boolean | undefined {
    return (
      this.currencyForm.get(controlName)?.hasError(errorName) &&
      this.currencyForm.get(controlName)?.touched
    );
  }
}
