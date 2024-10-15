// src/app/result/result.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  correct: number = 0;
  total: number = 0;
  percentage: number = 0;
  failed: boolean = false;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { correct: number, total: number, failed: boolean };

    if (state) {
      this.correct = state.correct;
      this.total = state.total;
      this.failed = state.failed;
      this.percentage = this.calculatePercentage(this.correct, this.total);
      
      // Debugging: Log the received state
      console.log('Received state:', state);
    } else {
      // If no state is passed, navigate back to the welcome page
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void { }

  calculatePercentage(correct: number, total: number): number {
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  }

  retakeTest() {
    this.router.navigate(['/test']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
