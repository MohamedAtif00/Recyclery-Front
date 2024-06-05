import { Component, OnInit } from '@angular/core';
import { Company } from '../model/company.model';
import { CompanyService } from '../services/company.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent implements OnInit{
  
  companies: Company[] = [];
  constructor(private companyServ:CompanyService){}

  ngOnInit(): void {
    this.companyServ.getCompanies().subscribe(data=>{
      this.companies = data
    })
  }


  addCompany()
  {}

  editCompany(company:Company)
  {}

  deleteCompany(email:string)
  { }
}
