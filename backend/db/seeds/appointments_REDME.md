// 1 
range miesiąc (6,9)
rok - 2024
range dzien miesiąc[0] -> dzien(0-30/31) zależnie ile ma dni
godzina(6,16:30)

wyloswować dzien, wygenerować godzine sprawdzić czy dana godzina nie została juz wygenerowana -> jezeli tak to powtórzyć {od początku} -> jeżeli nie to dodać do consta library który bedzie tymczasową psełdo biblioteką. powtórzeniu całości 1000 razy zrobić requesta z całą biblioteką 

const library = [{
    2024:{
      6:{
        1:[
          "9:00:00",
          "11:00:00"
        ],
        2:{}..
      },
      7:{},
      8:{},
      9:{},
    }
  }]

  miesięcy 3
  dni 30
  godzin 16


  dla tych dni które wylosowano niech skrypt sprawdzi jakie mają godziny zajęte, potem na podstawie tabeli z wszystkimi godzinami (od 9:00:00 do 16:30:00) uzupełni je wlasnie w te dni które uprzednio wylosowano, pamiętając by sprawdzić czy dana godzina juz nie jest w nie wpisana. sprawdzać na tablicy library a wpisuj nowe rekordy w nową jakąś tablice naprzykład const update = []. Na samym końcu skryptu zmapu tablice update by dla każdej godziny wygenerowała ${year}-${monthStr}-${dayStr} ${hoursStr}:${minutesStr}:${secondsStr}. Mozesz ten skrypt wykonać etapami 