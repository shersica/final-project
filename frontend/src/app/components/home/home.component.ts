import { Component, OnInit, inject } from '@angular/core';
import { Game } from '../../models';
import { GameService } from '../../game.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  private gameSvc = inject(GameService)
  games$!: Promise<Game[]>
  orderByControl = new FormControl('-relevance'); // Default orderBy option


  ngOnInit(): void {
    this.loadGames()
  }

  filter(){
    this.loadGames()
  }

  private loadGames(): void {
    const orderBy = this.orderByControl.value as string
    this.games$ = this.gameSvc.discoverGames(orderBy)
  }

  
}
