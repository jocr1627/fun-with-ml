import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ClarityModule } from '@clr/angular';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { AppComponent } from './app.component';
import { ButtonModule, DropdownModule } from './components';

@NgModule({
  declarations: [AppComponent],
  imports: [
    ApolloModule,
    BrowserModule,
    ButtonModule,
    ClarityModule,
    DropdownModule,
    FormsModule,
    HttpClientModule,
    HttpLinkModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    apollo.create({
      link: httpLink.create({ uri: 'http://localhost:4000' }),
      cache: new InMemoryCache()
    });
  }
}
