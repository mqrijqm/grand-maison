// Otvara prozor "B2B prijava" iz navbara sa bilo kog mjesta na sajtu (npr. "Zatražite poslovni nalog"
// na /za-firme). SiteHeader sluša događaj i otvara LoginModal u traženom režimu.
export type LoginMode = 'login' | 'register'
export const LOGIN_EVENT = 'gc-login'
export const openLogin = (mode: LoginMode = 'login') => window.dispatchEvent(new CustomEvent<LoginMode>(LOGIN_EVENT, { detail: mode }))
export const openRegistration = () => openLogin('register')
