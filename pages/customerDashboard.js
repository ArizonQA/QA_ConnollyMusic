
export class CustomerDashboard {

    constructor(page) {
        this.page = page;

        this.template=page.getByRole('link',{name: 'Templates'});

    }

   

}

