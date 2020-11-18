import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-accnt-verification',
  templateUrl: './accnt-verification.component.html',
  styleUrls: ['./accnt-verification.component.css']
})
export class AccntVerificationComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
            private router: Router,
            private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.verifyNewAccnt();
  }

  verifyNewAccnt(){
    let link = this.route.snapshot.paramMap.get('link');
    let result = this.authenticationService.verifyNewAccnt(link);
    
    if(result){
      result.subscribe(
        data => {
          alert("Account verified!");
          this.router.navigate(['/']);
        },
        error => {
          alert(error);
      });
    }
  }

}
