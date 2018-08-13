import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { OperationDefinitionNode } from 'graphql';
import { AppComponent } from './app.component';
import { ButtonModule, DropdownModule, LineChartModule } from './components';

@NgModule({
  declarations: [AppComponent],
  imports: [
    ApolloModule,
    BrowserAnimationsModule,
    BrowserModule,
    ButtonModule,
    ClarityModule,
    CommonModule,
    DropdownModule,
    FormsModule,
    HttpClientModule,
    HttpLinkModule,
    LineChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    const http = httpLink.create({
      uri: 'http://localhost:4000'
    });

    const ws = new WebSocketLink({
      uri: `ws://localhost:4000/graphql`,
      options: {
        reconnect: true
      }
    });

    const link = split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(
          query
        ) as OperationDefinitionNode;

        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      ws,
      http
    );

    apollo.create({
      link,
      cache: new InMemoryCache()
    });
  }
}
