/// <reference types="cypress"/>

import { onArticlePage } from "../support/articlePage"

describe('Test with Backend', () => {

    beforeEach('loggin to the app', () => {
        cy.intercept({method: 'Get ', path: 'tags'}, {fixture: 'tags.json'})
        cy.loginToApp()
    })

    it('should gave tags with routing object', () => {
        cy.get('.tag-list')
        .should('contain', 'cypress')
        .and('contain', 'test')
        .and('contain', '‌‌‌fuckingAwesome')
    })

    it('verify "request" and "respond" when create an article', () => {

        // Send a message to cypress console
        cy.log('Yeeei we logged in!')

        // Intercep the API Request
        cy.intercept('POST', '**/articles').as('postArticles')


        // Add new article and fill
        cy.contains(' New Article ').click()
        onArticlePage.fillNewArticle('Test title', 'About tests with cypress', 'cypress rocks', '#cypressTest')

        // Wait to complete the call
        cy.wait('@postArticles').then( xhr => {
            console.log('here is your request:', xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('cypress rocks')
            expect(xhr.request.body.article.description).to.equal('About tests with cypress')
        })
    })

    it.only('verify global feed likes count', () => {
        cy.intercept('GET', '**/articles*', {fixture: 'articles.json'})
        cy.intercept('GET', '**/articles/feed*', {"articles":[],"articlesCount":0})

        cy.contains(' Global Feed ').click()
        cy.get('app-article-list button').then( listOfbuttons => {
            expect(listOfbuttons[0]).to.contain('1')
            expect(listOfbuttons[1]).to.contain('50')
        })

        cy.fixture('articles').then( file => {
            const articleLink = file.articles[1].slug
            cy.intercept('POST', '**/articles/'+articleLink+'/favorite', file)
        })

        cy.get('app-article-list button').eq(1).click().should('contain', '51')
    })
})