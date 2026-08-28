import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { NavBar } from '../components/navbar.component';

export class HomePage extends BasePage {
  readonly navBar: NavBar;

  constructor(page: Page, baseURL = 'http://localhost:4200/') {
    super(page, baseURL);
    this.navBar = new NavBar(this.page, 'nav.navbar');
  }
}
