import { Component, OnInit, inject } from '@angular/core';
import { Filter, Game } from '../../models';
import { GameService } from '../../game.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  private gameSvc = inject(GameService)
  games$!: Observable<Game[]>
  orderByControl = new FormControl('-relevance'); // Default orderBy option
  page = 1
  filters: Filter[] = [
    {value: '-relevance', viewValue: 'Relevance'},
    {value: '-created', viewValue: 'Date Added'},
    {value: 'name', viewValue: 'Name'},
    {value: '-added', viewValue: 'Popularity'},
    {value: '-released', viewValue: 'Release Date'},
    {value: '-rating', viewValue: 'Average Rating'},
  ];
  selectedFilter = this.filters[0].value;

  ngOnInit(): void {
    this.loadGames()
  }

  filter(){
    this.page = 1
    this.loadGames()
  }

  nextPage(){
    this.page ++
    this.loadGames()
  }

  previousPage(){
    this.page --
    this.loadGames()
  }

  private loadGames(): void {
    const orderBy = this.orderByControl.value as string
    console.log(orderBy)
    this.games$ = this.gameSvc.discoverGames(orderBy, this.page)
  }

  
}
