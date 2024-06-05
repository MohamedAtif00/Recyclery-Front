import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environment";
import { Category } from "../model/category.model";


@Injectable({
    providedIn:'root'
})
export class CategoryService{


    private getAllCategories:string = `${environment.localhost}Category`
    constructor(private _http:HttpClient){}

    GetAllCategories()
    {
        return this._http.get<Category[]>(this.getAllCategories)
    }
}