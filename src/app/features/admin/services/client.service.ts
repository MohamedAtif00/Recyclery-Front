import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environment";
import { Client } from "../model/client.model";


@Injectable({
    providedIn:'root'
})
export class ClientService{

    private getAllClients = `${environment.localhost}Account/AllClients`
    constructor(private _http:HttpClient){}

    GetAllClients()
    {
        return this._http.get<Client[]>(this.getAllClients);
    }
}