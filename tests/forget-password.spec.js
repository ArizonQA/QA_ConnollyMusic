import {test} from '../fixtures/base.js';
import { TestData } from '../testdata/AllTestData';

test('Validate forget password link redirection',async({AllPageObjects})=>{

    await AllPageObjects.login().navigate(TestData.Urls().CommerceHubAi);
    await AllPageObjects.page.waitForTimeout(1000);
    
    await AllPageObjects.login().ValidateForgetPasswordRedirection();
    await AllPageObjects.page.waitForTimeout(1000);

    await AllPageObjects.forget().validateForgetPasswordTab(TestData.forgetPassword().forgetPasswordHeading);
});