// src/app/test/test.component.ts

import { Component, OnInit, AfterViewInit, OnDestroy, HostListener, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

interface Question {
  text: string;
  options: { value: string, label: string }[];
  correctAnswer: string;
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('testContainer') testContainer!: ElementRef;

  minutes: number = 5;
  seconds: number = 0;
  intervalId: any;
  selected: boolean = false;

  currentQuestionIndex: number = 0;
  correctAnswers: number = 0;
  testFailed: boolean = false; // Flag to indicate if the test was failed by exiting fullscreen
  hasFinished: boolean = false; // Prevent multiple navigations

  questions: Question[] = [
    {
      text: 'What is 1 + 1?',
      options: [
        { value: '2', label: '2' },
        { value: '6', label: '6' },
        { value: '1', label: '1' },
        { value: '3', label: '3' }
      ],
      correctAnswer: '2'
    },
    {
      text: 'What is the capital of France?',
      options: [
        { value: 'Berlin', label: 'Berlin' },
        { value: 'London', label: 'London' },
        { value: 'Paris', label: 'Paris' },
        { value: 'Madrid', label: 'Madrid' }
      ],
      correctAnswer: 'Paris'
    }
    // Add more questions here if needed
  ];

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startTimer();
      this.document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.enterFullScreen();
      this.document.addEventListener('fullscreenchange', this.onFullScreenChange.bind(this));
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    if (isPlatformBrowser(this.platformId)) {
      this.document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
      this.document.removeEventListener('fullscreenchange', this.onFullScreenChange.bind(this));
    }
  }

  startTimer() {
    this.intervalId = setInterval(() => {
      if (this.seconds === 0) {
        if (this.minutes === 0) {
          clearInterval(this.intervalId);
          this.finishTest(); // Time is up, finish the test
        } else {
          this.minutes--;
          this.seconds = 59;
        }
      } else {
        this.seconds--;
      }
    }, 1000);
  }

  checkAnswer(event: any) {
    
    this.selected = true;

    const selectedValue = event.target.value;
    const currentQuestion = this.questions[this.currentQuestionIndex];

    if (selectedValue === currentQuestion.correctAnswer) {
      console.log('correct');
      this.correctAnswers++;
    } else {
      console.log('incorrect');
    }

    // No alerts are shown as per the requirement
  }

  previousQuestion() {
    this.selected = false;
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  nextQuestion() {
    this.selected = false;
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  finishTest(isForced: boolean = false) {
    if (this.hasFinished) return; // Prevent multiple navigations
    this.hasFinished = true;

    if (isForced) {
      // User failed the test by exiting fullscreen
      this.correctAnswers = 0;
      this.testFailed = true;
    }

    if (isPlatformBrowser(this.platformId)) {
      // Exit fullscreen
      this.exitFullScreen();
    }

    // Clear the timer
    clearInterval(this.intervalId);

    // Debugging: Log the state being passed
    console.log('Navigating to Result with state:', {
      correct: this.correctAnswers,
      total: this.questions.length,
      failed: this.testFailed
    });

    // Navigate to the Result page with the score and failure flag
    this.router.navigate(['/result'], { state: { correct: this.correctAnswers, total: this.questions.length, failed: this.testFailed } });
  }

  // Fullscreen methods
  enterFullScreen() {
    const elem = this.testContainer.nativeElement;
    if (this.document.fullscreenEnabled) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
      }
    }
  }

  exitFullScreen() {
    if (this.document.fullscreenElement) {
      this.document.exitFullscreen();
    }
  }

  // Handle fullscreen change
  onFullScreenChange() {
    if (!this.document.fullscreenElement) {
      // User exited fullscreen mode
      this.finishTest(true);
      
    }
  }

  // Handle visibility change to detect tab switching
  handleVisibilityChange() {
    if (this.document.hidden) {
      // User switched tabs or minimized the browser
      this.finishTest(true);
    }
  }

  // Prevent certain key combinations
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // Prevent Alt+Tab and other key combinations if possible
    if (event.altKey && (event.key === 'Tab' || event.key === 'F4')) {
      event.preventDefault();
    }
  }
}
