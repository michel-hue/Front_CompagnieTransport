import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

//import { environment } from '../../../environments/environment';
import { Params } from '../interface/core.interface';
import { IQnAModel } from '../interface/questions-answers.interface';

@Injectable({
  providedIn: 'root',
})
export class QuestionsAnswersService {
  private http = inject(HttpClient);
  private baseUrl = ""; // ← ton vrai URL

  getQuestionAnswers(payload?: Params): Observable<IQnAModel> {
    return this.http.get<IQnAModel>(`${this.baseUrl}/questions`, {
      params: payload as any, // ← { params: ... }
    });
  }
}
