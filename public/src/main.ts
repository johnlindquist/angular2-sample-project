import "es6-shim";
import "reflect-metadata";
import "zone.js";

import {NgFor, Component, View, bootstrap} from "angular2/angular2";
import {Http, httpInjectables} from "angular2/http";
import {HashLocationStrategy, LocationStrategy, RouteConfig, RouterOutlet, RouterLink, Router, routerInjectables} from 'angular2/router';
import {bind, Injectable} from "angular2/di";
import {EventEmitter, ObservableWrapper} from 'angular2/src/facade/async';

const SERVER = "http://localhost:3000/games";

class CartService{
    games = [];
    total =()=> this.games
                    .map(game => game.price)
                    .reduce((a, b)=> a + b);
}

@Component({selector:"game-cart"})
@View({
    templateUrl:"templates/game-cart.html",
    directives: [NgFor]
})
class GameCart{
    constructor(public cartService:CartService){}
}



@Component({
    selector:"game-item",
    properties: ["name", "thumbnail", "price"]

})
@View({templateUrl:"templates/game-item.html"})
class GameItem{
    color = () => this.price > 40 ? "red" : "white";
}


@Component({
    selector:"game-list"
})
@View({
    directives: [NgFor, GameItem],
    templateUrl:"templates/game-list.html"
})
class GameList{
    games = [];
    constructor(http:Http, public cartService:CartService){
        ObservableWrapper.subscribe(
            http.get(SERVER),
            response => this.games = response.json()
        );
        console.log(this.cartService);
    }

    onGameClick(game){
        console.log("clicked");
        console.log(game);
        this.cartService.games.push(game);
    }
}


@RouteConfig([
    {path:"/", as:"home", component:GameList},
    {path:"/cart", as:"cart", component:GameCart},
])
@Component({
    appInjector:[routerInjectables],
    selector:"game-store"
})
@View({
    directives: [RouterOutlet, RouterLink],
    templateUrl:`templates/game-store.html`
})
class GameStore{
    onButtonClick(){
        console.log("Hello world");
    }
}

bootstrap(GameStore, [
    httpInjectables,
    routerInjectables,
    bind(LocationStrategy).toClass(HashLocationStrategy),
    CartService
    ]).then(
    success => console.log(success),
    error => console.log(error)
)