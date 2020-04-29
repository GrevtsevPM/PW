import { AppPage } from './app.po';
import { browser, logging, by, element, WebDriver } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  page = new AppPage();

  it('показывает заголовок', () => {
    page.navigateTo();
    let header=element(by.css('h1'));
    expect(header.getText()).toEqual("PW money transfer");
  });

  it('осуществляется log in', () => {
    let login = element(by.css('input[formcontrolname="email"]'));
    login.sendKeys('a@a.ru');
    browser.sleep(1000);
    let pass = element(by.css('input[formcontrolname="password"]'));
    pass.sendKeys('1');
    browser.sleep(1000);
    let btnSubmit = element(by.css('button[type="submit"]'));
    btnSubmit.click();
  });

  it('производится транзакция и выводится сообщение', () => {
    browser.get('/transaction');
    let name=element(by.css('#txtName input:first-child'));
    name.sendKeys('aaaa');
    browser.sleep(500);

    let amount=element(by.css('input[name="amount"]'));
    amount.sendKeys('1');
    browser.sleep(1000);

    let btnSubmit = element(by.css('button#btnSendTransaction'));
    btnSubmit.click();
    browser.sleep(2000);
    let lblTransactionInfo=element(by.css('#lblTransactionInfo'));
    expect(lblTransactionInfo.getText()).length>0;
  });

  it('производится транзакция и выводится сообщение (визуальная проверка)', () => {
    browser.get('/history');
    browser.sleep(5000);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
    browser.sleep(1000);
  });
});
