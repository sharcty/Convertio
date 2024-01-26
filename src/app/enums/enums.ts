export enum CurrencyCode {
    EUR = 'EUR',
    USD = 'USD',
    UAH = 'UAH',
}

export enum Theme {
    LIGHT = 'light',
    DARK = 'dark',
}

export enum ErrorType {
    UnsupportedCode = 'unsupported-code',
    MalformedRequest = 'malformed-request',
    InvalidKey = 'invalid-key',
    InactiveAccount = 'inactive-account',
    QuotaReached = 'quota-reached',
    UnknownError = 'unknown-error'
}

export enum FormControlIds {
    AMOUNT_TO = 'amountTo',
    AMOUNT_FROM = 'amountFrom'
}