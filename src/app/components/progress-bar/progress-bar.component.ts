import { Component, OnInit } from '@angular/core';

import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { ProgressBarService } from '../../services/progress-bar.service';


@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

  public loading: boolean;

  constructor(config: NgbProgressbarConfig, progressBar: ProgressBarService) {
    config.max = 1000;
    config.striped = true;
    config.animated = true;
    config.type = 'primary';

    progressBar.status.subscribe((status: boolean) => {
      this.loading = status;
    });
  }

  ngOnInit(): void {
  }

}
