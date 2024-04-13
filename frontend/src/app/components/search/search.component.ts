import { Component, inject } from '@angular/core';
import { GameService } from '../../game.service';
import { Game } from '../../models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  private activatedRoute = inject(ActivatedRoute)
  private fb: FormBuilder = inject(FormBuilder)
  searchForm!: FormGroup

  private gameSvc = inject(GameService)
  games$!: Promise<Game[]>

  ngOnInit(): void {
    const query = this.activatedRoute.snapshot.queryParams['query']
    this.games$ = this.gameSvc.searchGames(query)
    // this.searchForm = this.createForm()
  }

  createForm(): FormGroup {
    return this.fb.group({
      query: this.fb.control<string>('', [Validators.required]),
    })
  }

  search(){
    const query = this.searchForm.value['query']
    console.log(query)
    this.games$ = this.gameSvc.searchGames(query)
  }

}
