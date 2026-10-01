import loginTestData from '../testcase/datas.js';

export class ReorderPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Navigation and overview headings
    this.reorderNavTab = page.locator('.account-aside a, .account-navigation a').filter({ hasText: 'Reorder' }).first();
    this.pageHeading = page.getByRole('heading', { name: 'Smart Reorder Hub' });
    this.subtext = page.getByText('Bundle frequent fastener orders into reusable projects, predict restocking needs, and automate procurement – all from one place.');

    // Sections
    this.predictedSourcingHeading = page.getByRole('heading', { name: 'Predicted Sourcing Needs' });
    this.reusableProjectsHeading = page.getByRole('heading', { name: /Your Reusable Projects/i });
    this.aiRecommendationsHeading = page.getByRole('heading', { name: 'AI Smart Reorder Recommendations' });
    this.volumePatternHeading = page.getByRole('heading', { name: 'Monthly Volume Sourcing Pattern' });
    this.timelineHeading = page.getByRole('heading', { name: 'Procurement Timeline' });
    this.autoProcureHeading = page.getByRole('heading', { name: 'Set up fully automatic procurement' });

    // AI Autopilot switch
    this.aiAutopilotSwitch = page.locator('#aiAutopilotSwitch');
    this.aiAutopilotLabel = page.getByText('AI Autopilot Suggestions');
    this.aiAutopilotSubtext = page.getByText('Proactive recommendations');

    // Create New Project modal & triggers
    this.createProjectButton = page.getByRole('button', { name: /Create New Project/i });
    this.createProjectModal = page.locator('#createProjectModal');
    this.createProjectModalTitle = page.locator('#createProjectModalLabel');
    this.newProjectNameInput = page.locator('#newProjectNameInput');
    this.newProjectCategorySelect = page.locator('#newProjectCategorySelect');
    this.saveProjectButton = page.locator('#saveProjectBtn');
    this.cancelProjectButton = page.locator('#createProjectModal').getByRole('button', { name: 'Cancel' });
    this.closeProjectModalButton = page.locator('#createProjectModal .btn-close');

    // Your Reusable Projects elements
    this.viewAllListsLink = page.getByRole('link', { name: /View All Lists/i });
    this.projectCards = page.locator('.card, [class*="project-card"]').filter({ hasText: /One-Click Reorder/i });
    this.oneClickReorderButton = page.getByRole('button', { name: 'One-Click Reorder' }).first();

    // Enable Auto-Reordering modal & elements
    this.enableAutoReorderingButton = page.getByRole('button', { name: 'Enable Auto-Reordering' });
    this.autoProcureModal = page.locator('#autoProcureModal');
    this.autoProcureModalTitle = page.locator('#autoProcureModalLabel');
    this.autoProcureModalDescription = page.locator('#autoProcureModal p.text-muted');
    this.autoProcureListSelect = page.locator('#autoProcureListSelect');
    this.autoProcureScheduleDateTime = page.locator('#autoProcureScheduleDateTime');
    this.autoProcureEmailNotify = page.locator('#autoProcureEmailNotify');
    this.confirmAutoProcureButton = page.locator('#autoProcureModal').getByRole('button', { name: 'Schedule Auto-Reorder' });
    this.closeAutoProcureModalButton = page.locator('#autoProcureModal').getByRole('button', { name: 'Close' });
    this.dismissAutoProcureBtn = page.locator('#autoProcureModal .btn-close');

    // Monthly Volume Sourcing Pattern
    this.volumeInsightText = page.getByText(/Your replenishment rate peaks every September\/October/i);
    this.volumePatternSection = page.locator('div, section').filter({ hasText: 'Monthly Volume Sourcing Pattern' }).first();

    // Procurement Timeline
    this.timelinePastMarker = page.getByText('Past Order');
    this.timelinePredictedMarker = page.getByText('Predicted Restock Suggestion');

    // Adjust Replenishment Quantity Modal
    this.adjustQtyModal = page.locator('#adjustQtyModal');
    this.adjustQtyInput = page.locator('#adjustQtyInput');
    this.adjustMinus50Btn = page.locator('#adjustQtyModal').getByRole('button', { name: '- 50' });
    this.adjustPlus50Btn = page.locator('#adjustQtyModal').getByRole('button', { name: '+ 50' });
    this.closeAdjustModalBtn = page.locator('#adjustQtyModal').getByRole('button', { name: 'Close' });

    // Add to Project Modal
    this.addToProjectModal = page.locator('#addToProjectModal');
    this.addToProjectListSelect = page.locator('#addToProjectListSelect');
    this.addToProjectQtyInput = page.locator('#addToProjectQtyInput');
    this.confirmAddToProjectBtn = page.locator('#btnConfirmAddToProject');
    this.cancelAddToProjectBtn = page.locator('#addToProjectModal').getByRole('button', { name: 'Cancel' });
  }

  /**
   * Navigates directly to the Reorder page
   * @param {string} baseUrl
   */
  async gotoReorderPage(baseUrl = loginTestData.Url) {
    const reorderUrl = new URL('/account/reorder', baseUrl).toString();
    await this.page.goto(reorderUrl, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Clicks Reorder link in account navigation menu
   */
  async navigateViaAccountMenu() {
    await this.reorderNavTab.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Opens the Create New Project modal
   */
  async openCreateProjectModal() {
    await this.createProjectButton.click();
    await this.createProjectModal.waitFor({ state: 'visible' });
  }

  /**
   * Fills project name and selects category in modal
   * @param {string} name
   * @param {string} category
   */
  async fillNewProject(name, category = 'Structural') {
    if (name !== undefined) {
      await this.newProjectNameInput.fill(name);
    }
    if (category) {
      await this.newProjectCategorySelect.selectOption({ label: category }).catch(async () => {
        await this.newProjectCategorySelect.selectOption({ value: category });
      });
    }
  }

  /**
   * Submits Create Project form
   */
  async submitCreateProject() {
    await this.saveProjectButton.click();
  }

  /**
   * Closes Create Project modal via Cancel button
   */
  async cancelCreateProject() {
    await this.cancelProjectButton.click();
  }

  /**
   * Opens Enable Auto-Reordering modal
   */
  async openAutoReorderModal() {
    await this.enableAutoReorderingButton.click();
    await this.autoProcureModal.waitFor({ state: 'visible' });
  }

  /**
   * Closes Auto-Reordering modal via Close button
   */
  async closeAutoReorderModal() {
    await this.closeAutoProcureModalButton.click();
  }

  /**
   * Toggles AI Autopilot suggestions
   * @param {boolean} enable
   */
  async setAiAutopilot(enable) {
    const isCurrentlyChecked = await this.aiAutopilotSwitch.isChecked();
    if (isCurrentlyChecked !== enable) {
      await this.aiAutopilotSwitch.click();
    }
  }

  /**
   * Clicks One-Click Reorder button on first project card
   */
  async clickOneClickReorder() {
    await this.oneClickReorderButton.click();
  }

  /**
   * Gets all One-Click Reorder buttons visible on project cards
   * @returns {Locator} Collection of One-Click Reorder buttons
   */
  getAllOneClickReorderButtons() {
    return this.page.getByRole('button', { name: /One-Click Reorder/i });
  }

  /**
   * Finds the first project card with a price > 0
   * @returns {Promise<Object|null>}  Object with button locator and details, or null if not found
   */
  async findProjectCardWithPrice() {
    const buttons = this.getAllOneClickReorderButtons();
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      
      // Get the text near the button to inspect pricing
      try {
        // Look for price info immediately before or after the button
        const parentText = await btn.locator('xpath=ancestor::*/text()').allTextContents().catch(() => []);
        const nearbyText = await btn.locator('xpath=(ancestor::div)[1]//text()').allTextContents().catch(() => []);
        
        const allNearbyText = [...parentText, ...nearbyText].join(' ');
        const priceMatch = allNearbyText.match(/\$\s?([0-9,]+\.[0-9]{2})/);
        
        if (priceMatch) {
          const price = parseFloat(priceMatch[1].replace(/,/g, ''));
          if (price > 0) {
            return {
              button: btn,
              price: price,
              priceText: priceMatch[0]
            };
          }
        }
      } catch (e) {
        // Continue with next button
      }
    }
    
    return null;
  }

  /**
   * Finds all project button info to help with debugging
   * @returns {Promise<Array>} Array of button info objects
   */
  async getAllProjectButtonInfo() {
    const buttons = this.getAllOneClickReorderButtons();
    const count = await buttons.count();
    const buttonInfos = [];

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      
      try {
        // Get surrounding text content
        const surroundingDiv = btn.locator('xpath=(ancestor::*[contains(@class, "card") or contains(@class, "project")])[1]');
        const divText = await surroundingDiv.innerText().catch(async () => {
          return await btn.locator('xpath=(ancestor::div)[3]').innerText();
        });
        
        const priceMatch = divText.match(/\$\s?([0-9,]+\.[0-9]{2})/);
        const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
        
        buttonInfos.push({
          index: i,
          price,
          priceText: priceMatch ? priceMatch[0] : 'No price',
          sample: divText.substring(0, 200)
        });
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    return buttonInfos;
  }
}
