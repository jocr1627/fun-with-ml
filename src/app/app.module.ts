import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule, ClrFormsNextModule } from '@clr/angular';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { OperationDefinitionNode } from 'graphql';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import {
  ButtonModule,
  DropdownModule,
  InputModule,
  LineChartModule
} from './components';

@NgModule({
  declarations: [AppComponent],
  imports: [
    ApolloModule,
    BrowserAnimationsModule,
    BrowserModule,
    ButtonModule,
    ClarityModule,
    ClrFormsNextModule,
    CommonModule,
    DropdownModule,
    FormsModule,
    HttpClientModule,
    HttpLinkModule,
    InputModule,
    LineChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    const { apiUri, subscriptionsUri } = environment;
    const http = httpLink.create({
      uri: apiUri
    });

    const ws = new WebSocketLink({
      uri: subscriptionsUri,
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
