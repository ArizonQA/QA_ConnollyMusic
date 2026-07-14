import { expect } from '@playwright/test';

export class DashboardPage {

    constructor(page) {
        this.page = page;

        this.dashboardText = page.getByRole('main');
    }

    async verifyDashboardForCommerceHubAi() {

        await expect(this.dashboardText).toContainText('Monitor integrations, review operational alerts, and keep enterprise workflows compliant from a single admin command view.'
        );

    }

}