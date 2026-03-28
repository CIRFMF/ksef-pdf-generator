export const FARRRolaPodmiotu3: Record<string, string> = {
  '1': 'Faktor - w przypadku gdy na fakturze występują dane faktora',
  '2': 'Odbiorca - w przypadku gdy na fakturze występują dane jednostek wewnętrznych, oddziałów, wyodrębnionych w ramach nabywcy, które same nie stanowią nabywcy w rozumieniu ustawy',
  '3': 'Podmiot pierwotny - w przypadku gdy na fakturze występują dane podmiotu będącego w stosunku do podatnika podmiotem przejętym lub przekształconym, który dokonywał dostawy lub świadczył usługę. Z wyłączeniem przypadków, o których mowa w art. 106j ust.2 pkt 3 ustawy, gdy dane te wykazywane są w części Podmiot1K',
  '5': 'Wystawca faktury - w przypadku gdy na fakturze występują dane podmiotu wystawiającego fakturę w imieniu podatnika. Nie dotyczy przypadku, gdy wystawcą faktury jest nabywca',
  '6': 'Dokonujący płatności - w przypadku gdy na fakturze występują dane podmiotu regulującego zobowiązanie w miejsce nabywcy',
  '7': 'Jednostka samorządu terytorialnego - wystawca',
  '8': 'Jednostka samorządu terytorialnego - odbiorca',
  '9': 'Członek grupy VAT - wystawca',
  '10': 'Członek grupy VAT - odbiorca',
  '11': 'Pracownik',
};

export const FARRTypKorekty: Record<string, string> = {
  '1': 'Korekta skutkująca w dacie ujęcia faktury pierwotnej',
  '2': 'Korekta skutkująca w dacie wystawienia faktury korygującej',
  '3': 'Korekta skutkująca w dacie innej',
  '4': 'Korekta skutkująca w dacie dokonania zwrotu całości lub części należności',
};

export const TStawkaPodatku_FARR: Record<string, string> = {
  '7': '7%',
  '6.5': '6.5%',
};
