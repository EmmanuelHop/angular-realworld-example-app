

export class ArticlePage {
    fillNewArticle(title, about, content, tags) {
        cy.get('form').then( form => {
            cy.wrap(form).find('[placeholder="Article Title"]').type(title)
            cy.wrap(form).find('[formcontrolname="description"]').type(about)
            cy.wrap(form).find('[formcontrolname="body"]').type(content)
            cy.wrap(form).find('[placeholder="Enter tags"]').type(tags)
            cy.wrap(form).contains(' Publish Article ').click()
        })
    }

}

export const onArticlePage = new ArticlePage()