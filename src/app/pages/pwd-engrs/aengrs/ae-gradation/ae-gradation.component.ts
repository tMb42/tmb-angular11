import { Component, OnInit } from '@angular/core';
import { AeSelectedGradations } from 'src/app/models/aengrs.model';
import { AengrsService } from 'src/app/services/aengrs.service';

@Component({
  selector: 'app-ae-gradation',
  templateUrl: './ae-gradation.component.html',
  styleUrls: ['./ae-gradation.component.scss']
})
export class AeGradationComponent implements OnInit {
  aeGradations: AeSelectedGradations[];
  isLoading = false;

  constructor(private aEngrsService: AengrsService) { }

  ngOnInit(): void {    
    this.getAeLatestGradationList();    
  }

  getAeLatestGradationList(){
    this.isLoading = true;
    this.aEngrsService.getAeLatestGradations().subscribe((response) => { 
      console.log(response);
      this.isLoading = false;
      // this.aeGradations = response;
    })
  }

}
