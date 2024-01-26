import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CurrencyService } from '../services/currency.service';

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

  constructor(currencyService: CurrencyService, private cdr: ChangeDetectorRef){
    this.currencyService = currencyService;
  }

  convertCurrency(event?: any){
    if(event && event.target.id === "amountTo"){
      this.currencyService.convertCurrency(this.currencyForm.value.toCurrency, this.currencyForm.value.fromCurrency, event.target.value).subscribe(
        result => {
          let bb = result.conversion_result? result.conversion_result : 0;
          this.currencyForm.get('amountFrom')?.patchValue(bb, {onlySelf: true, emitEvent: false});
          this.currencyForm.get('amountTo')?.patchValue(event.target.value);
        }
      );
    }else if(event && event.target.id === "amountFrom"){
      this.currencyService.convertCurrency(this.currencyForm.value.fromCurrency, this.currencyForm.value.toCurrency, event.target.value).subscribe(
        result => {
          let val = result.conversion_result? result.conversion_result : 0;
          this.currencyForm.get('amountFrom')?.patchValue(event.target.value);
          this.currencyForm.get('amountTo')?.patchValue(val, {onlySelf: true, emitEvent: false });
        }
      );
    }
    else{
      this.currencyService.convertCurrency(this.currencyForm.value.fromCurrency, this.currencyForm.value.toCurrency, this.currencyForm.value.amountFrom).subscribe(
        result => {
          let val = result.conversion_result? result.conversion_result : 0;
          this.currencyForm.get('amountTo')?.patchValue(val, {onlySelf: true, emitEvent: false });
        }
      );
    }
    this.cdr.detectChanges();
  }

  setCurrencyType(event: any) {
    this.currencyForm.get(event.target.id)?.patchValue(event.target.value);
    this.convertCurrency(event);
  }

  swapCurrency() {
    let currencyFrom = this.currencyForm.value.fromCurrency;
    this.currencyForm.value.fromCurrency = this.currencyForm.value.toCurrency;
    this.currencyForm.value.toCurrency = currencyFrom; 
    this.convertCurrency(null);
  }
}
