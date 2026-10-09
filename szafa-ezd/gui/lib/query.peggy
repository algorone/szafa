// Prosta gamatyka do zapytan ala google
// od:12.01.2022 do:31.12.2024 faktura vat "ATX 345" mdrzazga@wp.pl """hasło do klasyfikacji""" 

Start 
 = Grupa1|..,_|
 
Grupa1
	=  Od / Do / Moje /KlasyfikacjaHaslo /Klasyfikacja
    / $('"' Slowa '"') 
    / Slowo
    
    
Slowa
	= $Slowo|..,_|
    
Slowo
    = $([^ \t\n\r"]+)

_ "whitespace"
  = [ \t\n\r]*

Od
 = "od:" lab:$[0-9,-.]+ {return {"od":lab}}
Do
 = "do:" lab:$[0-9,-.]+  {return {"do":lab}}
Moje
 = "moje:" {return {"moje":true}}
Klasyfikacja
 = "klasyfikacja:" lab:$[A-Z,0-9,-.]+ {return {"klasyfikacja":lab}}
 
KlasyfikacjaHaslo
 = '"""' lab:$(Slowa)'"""' {return {"klasyfikacjaHaslo":lab}}